require 'concerns/user_provided_services'

class AppParamCredentials
  extend UserProvidedService

  def self.asset_host
    if use_env_var?
      ENV["ASSET_HOST"]
    else
      credentials('ASSET_HOST')
    end
  end

  def self.default_url_host
    if use_env_var?
      ENV["DEFAULT_URL_HOST"]
    else
      credentials('DEFAULT_URL_HOST')
    end
  end

  def self.secret_token
    if use_env_var?
      ENV["SECRET_TOKEN"]
    else
      credentials('SECRET_TOKEN')
    end
  end
end
