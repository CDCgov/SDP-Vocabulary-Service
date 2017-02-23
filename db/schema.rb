# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170217164345) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authentications", force: :cascade do |t|
    t.string   "provider",   null: false
    t.string   "uid",        null: false
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_authentications_on_user_id", using: :btree
  end

  create_table "comments", force: :cascade do |t|
    t.string   "title",            limit: 50, default: ""
    t.integer  "parent_id"
    t.text     "comment"
    t.string   "commentable_type"
    t.integer  "commentable_id"
    t.integer  "user_id"
    t.string   "role",                        default: "comments"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["commentable_id"], name: "index_comments_on_commentable_id", using: :btree
    t.index ["commentable_type"], name: "index_comments_on_commentable_type", using: :btree
    t.index ["user_id"], name: "index_comments_on_user_id", using: :btree
  end

  create_table "concepts", force: :cascade do |t|
    t.text     "value"
    t.string   "code_system"
    t.string   "display_name"
    t.integer  "question_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["question_id"], name: "index_concepts_on_question_id", using: :btree
  end

  create_table "form_questions", force: :cascade do |t|
    t.integer  "form_id"
    t.integer  "question_id"
    t.integer  "response_set_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "forms", force: :cascade do |t|
    t.string   "name"
    t.integer  "created_by_id"
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.string   "version_independent_id"
    t.integer  "version",                          default: 1
    t.string   "control_number",         limit: 9
    t.string   "oid"
    t.text     "description"
    t.string   "status",                           default: "draft"
    t.index ["created_by_id"], name: "index_forms_on_created_by_id", using: :btree
  end

  create_table "notifications", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "url"
    t.string   "message"
    t.boolean  "read",       default: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["user_id"], name: "index_notifications_on_user_id", using: :btree
  end

  create_table "question_response_sets", force: :cascade do |t|
    t.integer  "question_id"
    t.integer  "response_set_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "question_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "questions", force: :cascade do |t|
    t.text     "content"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "question_type_id"
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.string   "version_independent_id"
    t.integer  "version",                default: 1
    t.integer  "response_type_id"
    t.string   "oid"
    t.text     "description"
    t.string   "status",                 default: "draft"
    t.boolean  "harmonized"
    t.index ["created_by_id"], name: "index_questions_on_created_by_id", using: :btree
    t.index ["question_type_id"], name: "index_questions_on_question_type_id", using: :btree
    t.index ["response_type_id"], name: "index_questions_on_response_type_id", using: :btree
    t.index ["updated_by_id"], name: "index_questions_on_updated_by_id", using: :btree
  end

  create_table "response_sets", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "oid"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "created_by_id"
    t.integer  "updated_by_id"
    t.boolean  "coded"
    t.string   "version_independent_id"
    t.integer  "version",                default: 1
    t.integer  "parent_id"
    t.string   "status",                 default: "draft"
    t.index ["created_by_id"], name: "index_response_sets_on_created_by_id", using: :btree
    t.index ["updated_by_id"], name: "index_response_sets_on_updated_by_id", using: :btree
  end

  create_table "response_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "responses", force: :cascade do |t|
    t.text     "value"
    t.integer  "response_set_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "code_system"
    t.string   "display_name"
    t.index ["response_set_id"], name: "index_responses_on_response_set_id", using: :btree
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", using: :btree
    t.index ["name"], name: "index_roles_on_name", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "provider"
    t.string   "uid"
    t.boolean  "admin",                  default: false
    t.string   "first_name"
    t.string   "last_name"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", using: :btree
  end

  add_foreign_key "authentications", "users"
  add_foreign_key "concepts", "questions"
  add_foreign_key "forms", "users", column: "created_by_id"
  add_foreign_key "questions", "question_types"
  add_foreign_key "questions", "response_types"
  add_foreign_key "questions", "users", column: "created_by_id"
  add_foreign_key "questions", "users", column: "updated_by_id"
  add_foreign_key "response_sets", "users", column: "created_by_id"
  add_foreign_key "response_sets", "users", column: "updated_by_id"
  add_foreign_key "responses", "response_sets"
end
