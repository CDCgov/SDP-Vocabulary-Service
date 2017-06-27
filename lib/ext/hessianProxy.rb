require 'net/http'

module Hessian

  class HessianProxy

    def initialize(url, proxy={})
      puts "called"
      parseUrl(url)
      @proxy = proxy

    end

    def method_missing(method_id, *args)
      return call(method_id.id2name, args)
    end

   private

    def call(methodName, args)
      data = Serializer.new.serialize(methodName, args)

      header = {'Content-Type' => 'application/binary'}

      Net::HTTP.start(@host, @port,*@proxy.values_at(:host, :port, :user, :password)) do |http|
        response = http.send_request('POST', @requestURI, data, header)
        return Deserializer.new.deserialize(response.body)
      end
    end

    def parseUrl(url)
      #url = 'http://testbox:8080/hello' or 'http://testbox/hello'
      url = url[7..url.size]#url = 'testbox:8080/hello' or 'testbox/hello'
      if (url[':'] != nil)#url = 'testbox:8080/hello'
        @host = url[0..url.index(':') - 1]
        @port = url[url.index(':') + 1..url.index('/') - 1]
      else#url = 'testbox/hello'
        @host = url[0..url.index('/') - 1]
        @port = '80'
      end

      @requestURI = url[url.index('/')..url.size]
    end

  end#HessianProxy

  class HessianProxyException < RuntimeError

    def initialize(m)
      super(m)
    end

  end#HessianProxyException

  class Binary

    attr_reader :data
    attr_writer :data

    def initialize(data)
      @data = data
    end

  end#Binary

##########################################################
#    The following classes are for private use only.     #
##########################################################
  class Deserializer

    def deserialize(s)
      @is = InputStream.new(s)
      @idRefMap = Hash.new

      tag = @is.readNextChar
      raise HessianProxyException.new("Invalid tag, expected 'r', received '" + tag + "'") if (tag != 'r')

      major = @is.readNextChar
      minor = @is.readNextChar
      puts "Major #{major} Minor #{minor}"
      value = parseObject()

      tag = @is.readNextChar
      raise HessianProxyException.new("Invalid tag, expected 'z', received '" + tag + "'") if (tag != 'z')

      value
    end

   private

    def parseObject()
      tag = @is.readNextChar

      if (tag == 'N')
        return nil
      elsif (tag == 'S')
        return parseString()
      elsif (tag == 'T')
        return true
      elsif (tag == 'F')
        return false
      elsif (tag == 'I')
        return parseInt()
      elsif (tag == 'L')
        return parseLong()
      elsif (tag == 'D')
        return parseDouble()
      elsif (tag == 'V')
        return parseList()
      elsif (tag == 'M')
        return parseMap()
      elsif (tag == 'R')
        return parseRef()
      elsif (tag == 'd')
        return parseDate()
      elsif (tag == 'B')
        return parseBinary()
      elsif (tag == 'f')
        return parseFault()
      end

      raise HessianProxyException.new("Invalid tag: '" + tag + "'")
    end

    def parseString()
      b16 = @is.readNextByte
      b8 = @is.readNextByte

      length = (b16 << 8) + b8

      return @is.readNextString(length)
    end

    def parseInt()
      b32 = @is.readNextByte & 0xFF
      b24 = @is.readNextByte & 0xFF
      b16 = @is.readNextByte & 0xFF
      b8 = @is.readNextByte & 0xFF

      return((b32 << 24) + (b24 << 16) + (b16 << 8) + b8) & 0x00000000FFFFFFFF
    end

    def parseLong()
      b64 = @is.readNextByte & 0xFF
      b56 = @is.readNextByte & 0xFF
      b48 = @is.readNextByte & 0xFF
      b40 = @is.readNextByte & 0xFF
      b32 = @is.readNextByte & 0xFF
      b24 = @is.readNextByte & 0xFF
      b16 = @is.readNextByte & 0xFF
      b8 = @is.readNextByte & 0xFF

      value = (b64 << 56) +
              (b56 << 48) +
              (b48 << 40) +
              (b40 << 32) +
              (b32 << 24) +
              (b24 << 16) +
              (b16 << 8) +
              b8

      return value
    end

    def parseDouble()
      return @is.readNextString(8).unpack("G")[0]
    end

    def parseList()
      list = Array.new
      storeRef(list)

      tag = @is.readNextChar
      if (tag == 't')
        skipTypeName

        tag = @is.readNextChar
      end

      if (tag == 'l')
        #skip list length
        @is.readNextString(4)

        tag = @is.readNextChar
      end

      while (tag != 'z')
        @is.undoLastRead

        nextObject = parseObject()
        list.push(nextObject)

        tag = @is.readNextChar
      end

      list
    end

    def parseMap()
      map = Hash.new
      storeRef(map)

      tag = @is.readNextChar
      if (tag == 't')
        skipTypeName

        tag = @is.readNextChar
      end

      while (tag != 'z')
        @is.undoLastRead

        key = parseObject()
        value = parseObject()
        map[key] = value

        tag = @is.readNextChar
      end

      map
    end

    def parseRef()
      id = parseInt()
      @idRefMap[id]
    end

    def parseDate()
      milliSecSinceEpoch = parseLong
      secSinceEpoch = milliSecSinceEpoch / 1000
      microSecSinceEpoch = (milliSecSinceEpoch % 1000) * 1000

      Time.at(secSinceEpoch, microSecSinceEpoch)
    end

    def parseBinary()
      data = parseString

      Binary.new(data)
    end

    def parseFault()
      parseObject
      code = parseObject

      parseObject
      message = parseObject

      raise HessianProxyException.new(code + ":" + message)
    end

    def storeRef(o)
      @idRefMap[@idRefMap.length] = o
    end

    def skipTypeName()
      b16 = @is.readNextByte
      b8  = @is.readNextByte

      typeNameLength = (b16 << 8) + b8

      #skip type name
      @is.readNextString(typeNameLength)
    end

  end#Deserializer

  class Serializer

    def serialize(methodName, args)
      @refIdMap = Hash.new

      startCall(methodName)

      args.each do |arg|
        writeObject(arg)
      end

      completeCall()

      @s
    end

   private

    def startCall(methodName)
      @s = 'c'

      append(0)
      append(1)

      @s += 'm'

      writeLength(methodName.length)

      @s += methodName
    end

    def completeCall()
      @s += 'z'
    end

    def writeObject(o)
      if (o == nil)
        @s += 'N'
      elsif (o.kind_of? String)
        writeString(o)
      elsif (o.kind_of? Integer)
        if (o >= -2147483648) && (o <= 2147483647)
          writeInt(o)
        else
          writeLong(o)
        end
      elsif (o.kind_of? Float)
        writeDouble(o)
      elsif ((o.kind_of? FalseClass) || (o.kind_of? TrueClass))
        writeBoolean(o)
      elsif (o.kind_of? Array)
        writeList(o)
      elsif (o.kind_of? Hash)
        writeMap(o)
      elsif (o.kind_of? Time)
        writeDate(o)
      elsif (o.kind_of? Binary)
        writeBinary(o)
      end
    end

    def writeLength(l)
      mlen16 = l >> 8
      mlen8 = l & 0x00FF

      append(mlen16)
      append(mlen8)
    end

    def writeString(o)
      @s += 'S'

      writeStringData(o)
    end

    def writeStringData(o)
      writeLength(o.length)

      @s += o
    end

    def writeBoolean(o)
      @s += o ? 'T' : 'F'
    end

    def writeInt(o)
      @s += 'I'

      writeInt4(o)
    end

    def writeInt4(o)
      b32 = o >> 24
      b24 = (o >> 16) & 0x000000FF
      b16 = (o >> 8) & 0x000000FF
      b8 = o & 0x000000FF

      append(b32)
      append(b24)
      append(b16)
      append(b8)
    end

    def writeLong(o)
      @s += 'L'

      writeLong8(o)
    end

    def writeLong8(o)
      b64 = (o >> 56) & 0x00000000000000FF
      b56 = (o >> 48) & 0x00000000000000FF
      b48 = (o >> 40) & 0x00000000000000FF
      b40 = (o >> 32) & 0x00000000000000FF
      b32 = (o >> 24) & 0x00000000000000FF
      b24 = (o >> 16) & 0x00000000000000FF
      b16 = (o >> 8) & 0x00000000000000FF
      b8 = o & 0x00000000000000FF

      append(b64)
      append(b56)
      append(b48)
      append(b40)
      append(b32)
      append(b24)
      append(b16)
      append(b8)
    end

    def writeDouble(o)
      append('D')

      d = [o].pack("G")
      append(d[0])
      append(d[1])
      append(d[2])
      append(d[3])
      append(d[4])
      append(d[5])
      append(d[6])
      append(d[7])
    end

    def writeList(o)
      return if writeRef(o)

      @s += 'V'
      @s += 't'
      append(0)
      append(0)
      @s += 'l'
      writeInt4(o.length)

      o.each do |nextItem|
        writeObject(nextItem)
      end

      @s += 'z'
    end

    def writeMap(o)
      return if writeRef(o)

      @s += 'M'
      @s += 't'
      append(0)
      append(0)

      keys = o.keys
      keys.each do |key|
        writeObject(key)
        writeObject(o[key])
      end

      @s += 'z'
    end

    def writeDate(o)
      @s += 'd'

      secSinceEpoch = o.to_f
      milliSecSinceEpoch = secSinceEpoch * 1000
      milliSecSinceEpoch = milliSecSinceEpoch.round

      writeLong8(milliSecSinceEpoch)
    end

    def writeBinary(o)
      @s += 'B'

      writeStringData(o.data)
    end

    #Returns true if reference was found and object should not be written by caller.
    def writeRef(o)
      id = @refIdMap[o]

      if (id != nil)
        @s += 'R'
        writeInt4(id)
        return true
      else
        @refIdMap[o] = @refIdMap.length
        return false
      end
    end

    def append(i)
      @s = @s + '#'
      @s[@s.length - 1] = i.to_s
    end

  end#Serializer

  class InputStream

    def initialize(s)
      @input = s
      @offset = 0
    end

    def readNextByte()
      readNextChar[0]
    end

    def readNextChar()
      readNextString(1)
    end

    def undoLastRead()
      @offset -= 1
    end

    def readNextString(length)
      val = @input[@offset..@offset + length - 1]
      @offset += length
      val
    end

  end#InputStream

end#module hessian
