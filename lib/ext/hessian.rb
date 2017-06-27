require 'uri'
require 'net/http'
require 'net/https'

module Hessian
  class TypeWrapper
    attr_accessor :hessian_type, :object
    def initialize(hessian_type, object)
      @hessian_type, @object = hessian_type, object
    end
  end

  class Binary
    attr :data
    def initialize(data)
      @data = data.to_s
    end
  end

  class HessianException < RuntimeError
    attr_reader :code
    def initialize(code)
      @code = code
    end
  end

  class HessianClient
    attr_accessor :user, :password
    attr_reader :scheme, :host, :port, :path, :proxy
    def initialize(url, proxy = {})
      uri = URI.parse(url)
      @scheme, @host, @port, @path = uri.scheme, uri.host, uri.port, uri.path
      raise "Unsupported Hessian protocol: #@scheme" unless @scheme == 'http' || @scheme == 'https'
      @proxy = proxy
    end

    def method_missing(id, *args)
      return invoke(id.id2name, args)
    end

    private
    def invoke(method, args)
      call = HessianWriter.new.write_call method, args
      header = { 'Content-Type' => 'application/binary' }
      req = Net::HTTP::Post.new(@path, header)
      req.basic_auth @user, @password if @user
      conn = Net::HTTP.new(@host, @port, *@proxy.values_at(:host, :port, :user, :password))
      conn.use_ssl = true and conn.verify_mode = OpenSSL::SSL::VERIFY_NONE if @scheme == 'https'
      conn.start do |http|
        res = http.request(req, call)
        body = res.body
        HessianParser.new.parse_response body
      end
    end

    class HessianWriter
      def write_call(method, args)
        @refs = {}
        out = [ 'c', '0', '1', 'm', method.length ].pack('ahhan') << method
        args.each { |arg| out << write_object(arg) }
        out << 'z'
      end

      private
      def write_object(val, hessian_type = nil)
        return 'N' if val.nil?
        case val
        when TypeWrapper
          write_object(val.object, val.hessian_type)
        when Struct
          write_object(val.members.inject({}) { |map, m| map[m] = val[m]; map })
        when Binary
          [ 'B', val.data.length ].pack('an') << val.data
        when String
          [ 'S', val.length ].pack('an') << val.unpack('C*').pack('U*')
        when
          Integer
          # Max and min values for integers in Java.
          if val >= -0x80000000 && val <= 0x7fffffff
            [ 'I', val ].pack('aN')
          else
            "L%s" % to_long(val)
          end
        when Float
          [ 'D', val ].pack('aG')
        when Time
          "d%s" % to_long((val.to_f * 1000).to_i)
        when TrueClass
          'T'
        when FalseClass
          'F'
        when Array
          ref = write_ref val; return ref if ref
          t = hessian_type_string(hessian_type, val)
          str = 'Vt' << t << 'l' << [ val.length ].pack('N')
          val.each { |v| str << write_object(v) }
          str << 'z'
        when Hash
          ref = write_ref val; return ref if ref
          str = 'Mt' << hessian_type_string(hessian_type, val)
          val.each { |k, v| str << write_object(k); str << write_object(v) }
          str << 'z'
        else
          raise "Not implemented for #{val.class}"
        end
      end

      def hessian_type_string(hessian_type, object)
        if hessian_type.nil? && object.respond_to?(:hessian_type)
          hessian_type = object.hessian_type
        end
        hessian_type ? [ hessian_type.length, hessian_type ].pack('na*') : "\000\000"
      end

      def to_long(val)
        str, pos = " " * 8, 0
        56.step(0, -8) { |o| str[pos] = val >> o & 0x00000000000000ff; pos += 1 }
        str
      end

      def write_ref(val)
        id = @refs[val.object_id]
        if id
          [ 'R', id ].pack('aN')
        else
          @refs[val.object_id] = @refs.length
          nil
        end
      end
    end

    class HessianParser

      def parse_response(res)
        raise "Invalid response, expected 'r', received '#{res[0,1]}'" unless res[0,1] == 'r'
        @chunks = []
        @refs = []
        @data = res[3..-1]
        @indent = -2
        parse_object
      end

      private
      def parse_object

        # log("parseObject")
        # log("data top ",  @data.slice(0, 30))
        t = @data.slice!(0, 1)
        # log("case " +t)
        case t
        when 'f'
          # log("when f")
            raise_exception
        when 's', 'S', 'x', 'X'
          #log("when s")
          s2 = @data.slice!(0, 2)
          # log("s2", s2)
          up = s2.unpack('n')
        #  log("up", up)
          v = from_utf8(up[0])
        #  log("v", v)
        #  log("v1", v[1])
        #  log("v[0]length", v[0].length)
        #  log("data slice v[0].length", @data.slice(0, v[0].length))
        #  log("data slice v[1]", @data.slice(0, v[1]))
        #  log("data slice v[1] + 10 ", @data.slice(0, v[1]+10))
          @data.slice!(0, v[0].length > v[1] ? v[0].length : v[1])
          @chunks << v[0]
          if 'sx'.include? t
            parse_object
          else
            str = @chunks.join; @chunks.clear; str
          end
        when 'b', 'B'
          v = @data.slice!(0, @data.slice!(0, 2).unpack('n')[0])
          @chunks << v
          if t == 'b'
            parse_object
          else
            bytes = @chunks.join; @chunks.clear; Binary.new bytes
          end
        when 'I'
          @data.slice!(0, 4).unpack('N')[0]
        when 'L'
          parse_long
        when 'd'
           l = parse_long; Time.at(l / 1000, l % 1000 * 1000)
        when 'D'
           @data.slice!(0, 8).unpack('G')[0]
        when 'T'
          true
        when 'F'
          false
        when 'N'
          nil
        when 'R'
          @refs[@data.slice!(0, 4).unpack('N')[0]]
        when 'V'
          # Skip type + type length (2 bytes) if specified.
          @data.slice!(0, 3 + @data.unpack('an')[1]) if @data[0,1] == 't'
          # Skip the list length if specified.
          @data.slice!(0, 5) if @data[0,1] == 'l'
          @refs << (list = [])
          list << parse_object while @data[0,1] != 'z'
          # Get rid of the 'z'.
          @data.slice!(0, 1)
           list
        when 'M'
          # Skip type + type length (2 bytes) if specified.
          @data.slice!(0, 3 + @data.unpack('an')[1]) if @data[0,1] == 't'
          @refs << (map = {})
          map[parse_object()] = parse_object while @data[0,1] != 'z'
          # Get rid of the 'z'.
          @data.slice!(0, 1)
           map
        else
          raise "Invalid type: '#{t}'"
        end

      end

      def log(*args)
        str = " " * 2
        print str
        args.each do |message|
          print "|| "
          print message
        end
        print "||\n"

      end
      def from_utf8(len = '*')
        unpacked = @data.unpack("U#{len}")
        #log("unpacked ",unpacked)
        s = unpacked.pack('C*')
      #  log("Packed ", s)

        plus = 0
        unpacked.each do |v|
          if v > 126 && v < 7000
            plus +=1
          elsif v >= 7000
            plus += 2
          end
          # plus +=1 if v == 160
          # plus +=1 if v == 197
          # plus +=1 if v == 201
          # plus +=1 if v == 233
          # # plus +=1 if v == 232
          # # plus +=1 if v == 228
          # # plus +=1 if v == 174
          # # plus +=2 if v == 8220
          # # plus +=2 if v == 8221
          # # plus +=2 if v == 8211
          # # plus +=2 if v == 8217
          # # plus +=1 if v == 169
          # # plus +=2 if v == 8230
          # # plus +=1 if v == 212
          # # begin
          # #   plus +=1 if v.chr == '\xAE'
          # # rescue
          # # end
          # #
          # # begin
          # #   plus +=1 if v.chr == '\xA9'
          # # rescue
          # end
        end
        #log("packed unpacked length", s.unpack('C*').length)
        l = s.unpack('C*').pack('U*').length
        [ s, l+plus]
      end

      def parse_long
        val, o = 0, 56
        @data.slice!(0, 8).each_byte { |b| val += (b & 0xff) << o; o -= 8 }
        val
      end

      def raise_exception
        # Skip code description.
        parse_object
        code = parse_object
        # Skip message description
        parse_object
        msg = parse_object
        raise HessianException.new(code), msg
      end
    end
  end
end
