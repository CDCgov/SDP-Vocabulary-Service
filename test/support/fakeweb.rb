require 'fakeweb'
FakeWeb.allow_net_connect = %r{^https?://localhost}
FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: 'Hello World!')
FakeWeb.register_uri(:any, %r{http://www.google-analytics\.com/}, body: 'Google Analytics!')
