# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store,
                                       key: '_vocabulary_service_session',
                                       httponly: true,
                                       secure: Rails.env.production?
