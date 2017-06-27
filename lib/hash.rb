class Hash
  def respond_to_missing?(m, include_private = false)
    k = m.to_s.sub(/^get([A-Z])/) { Regexp.last_match(1).downcase.to_s }
    k2 = k[0...-1]
    key?(k) || key?(k.to_sym) || key?(k2) || key?(k2.to_sym) || key?(m) || key?(m.to_s) || super
  end

  def method_missing(m, *args, &block)
    k = m.to_s.sub(/^get([A-Z])/) { Regexp.last_match(1).downcase.to_s }
    k2 = k[0...-1]
    v = self[k] || self[k.to_sym] || self[k2] || self[k2.to_sym] || self[m] || self[m.to_s]
    if v
      return v
    elsif key?(k) || key?(k.to_sym) || key?(k2) || key?(k2.to_sym) || key?(m) || key?(m.to_s)
      return nil
    else
      super
    end
  end
end
