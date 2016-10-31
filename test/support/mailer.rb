module ActiveSupport
  class TestCase
    setup { ActionMailer::Base.deliveries.clear }
  end
end
