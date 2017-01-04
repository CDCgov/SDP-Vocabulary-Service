class CommentsController < ApplicationController
  load_and_authorize_resource only: [:show, :destroy, :reply_to]
  before_action :find_commentable, only: [:index]
  respond_to :json

  def index
    @comments = @commentable.comments
    render json: @comments, each_serializer: CommentSerializer
  end

  def show
    render json: @comment, serializer: CommentSerializer
  end

  def reply_to
    p = comment_params
    reply = @comment.create_reply(current_user, p[:title], p[:comment])
    SDP::CommentsNotifier.notify_users(reply)
    reply.save!
    render json: reply, serializer: CommentSerializer
  end

  def destroy
    @comment.destroy!
    render status: 204, text: ''
  end

  def create
    @comment = Comment.new(create_params)
    @comment.user = current_user
    @comment.save!

    SDP::CommentsNotifier.notify_users(@comment)

    render json: @comment, serializer: CommentSerializer
  end

  private

  def create_params
    params.require(:comment).permit(:parent_id, :commentable_type, :commentable_id, :title, :comment)
  end

  def find_commentable
    commentable_id = params[:commentable_id]
    commentable_type = params[:commentable_type]
    if commentable_id && commentable_type
      set_commentatble(commentable_type, commentable_id)
    else
      %w(question form response_set).each do |possible|
        possible_value = params["#{possible}_id"]
        if possible_value
          set_commentatble(possible, possible_value)
          break
        end
      end
    end
  end

  def set_commentatble(commentable_type, commentable_id)
    if commentable_id && commentable_type
      @commentable = commentable_type.classify.constantize.find(commentable_id)
    end
  end
end
