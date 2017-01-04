# OmniAuth.config.logger = Rails.logger
#
# Rails.application.config.middleware.use OmniAuth::Builder do
#   provider :developer unless Rails.env.production?
#
# provider :open_id, :name => 'google', :identifier => 'https://www.google.com/accounts/o8/id'
# provider :developer unless Rails.env.production?
#   provider :openid_connect, {
#   name: :my_provider,
#   scope: [:openid, :email, :profile, :address],
#   response_type: :code,
#   client_options: {
#     port: 443,
#     scheme: "https",
#     host: "myprovider.com",
#     identifier: ENV["OP_CLIENT_ID"],
#     secret: ENV["OP_SECRET_KEY"],
#     redirect_uri: "http://myapp.com/users/auth/openid_connect/callback",
#   },
# }
# end
