# rubocop:disable Metrics/PerceivedComplexity
# rubocop:disable Metrics/CyclomaticComplexity
module Searchable
  extend ActiveSupport::Concern

  module ClassMethods
    def search(search = nil, current_user_id = nil, publisher_search = false, my_stuff_search = false)
      search_col = has_attribute?(:name) ? 'name' : 'content'
      if my_stuff_search && current_user_id && search
        where("(created_by_id= ?) AND (#{search_col} ILIKE ?)", current_user_id, "%#{search}%")
      elsif my_stuff_search && current_user_id
        where('(created_by_id= ?)', current_user_id)
      elsif search && publisher_search
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

    def analytics_count(current_user)
      if current_user && current_user.publisher?
        all.count
      elsif current_user
        where("(status='published' OR created_by_id= #{current_user.id})").all.count
      else
        where(status: 'published').all.count
      end
    end
  end
end
# rubocop:enable Metrics/PerceivedComplexity
# rubocop:enable Metrics/CyclomaticComplexity
