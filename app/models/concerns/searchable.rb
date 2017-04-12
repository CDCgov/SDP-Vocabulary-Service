module Searchable
  extend ActiveSupport::Concern

  module ClassMethods
    def search(search = nil, current_user_id = nil, publisher_search = false)
      search_col = has_attribute?(:name) ? 'name' : 'content'
      if search && publisher_search
        where("#{search_col} ILIKE ?", "%#{search}%")
      elsif publisher_search
        all
      elsif current_user_id && search
        where("(status='published' OR created_by_id= ?) AND (#{search_col} ILIKE ?)", current_user_id, "%#{search}%")
      elsif current_user_id
        where("(status='published' OR created_by_id= ?)", current_user_id)
      elsif search
        where("status='published' and #{search_col} ILIKE ?", "%#{search}%")
      else
        where("status='published'")
      end
    end
  end
end
