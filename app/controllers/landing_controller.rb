class LandingController < ApplicationController
  def index
  end

  def stats
    response_set_count = ResponseSet.latest_versions.count
    question_count = Question.latest_versions.count
    form_count = Form.latest_versions.count
    survey_count = Survey.latest_versions.count

    render json: { response_set_count: response_set_count,
                   question_count: question_count,
                   form_count: form_count,
                   survey_count: survey_count }
  end
end
