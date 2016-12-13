namespace :jsroutes do
  # generate the rails path helpers as a javascript library to include in the frontend
  task generate: :environment do
    JsRoutes.assert_usable_configuration!
    File.open('webpack/routes.js', 'w') do |f|
      f.puts JsRoutes.generate
    end
  end
end
