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

ActiveRecord::Schema.define(version: 20180816080433) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authentications", id: :serial, force: :cascade do |t|
    t.string "provider", null: false
    t.string "uid", null: false
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_authentications_on_user_id"
  end

  create_table "categories", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", id: :serial, force: :cascade do |t|
    t.string "title", limit: 50, default: ""
    t.integer "parent_id"
    t.text "comment"
    t.string "commentable_type"
    t.integer "commentable_id"
    t.integer "user_id"
    t.string "role", default: "comments"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["commentable_id"], name: "index_comments_on_commentable_id"
    t.index ["commentable_type"], name: "index_comments_on_commentable_type"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "concepts", id: :serial, force: :cascade do |t|
    t.text "value"
    t.string "code_system"
    t.string "display_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "taggable_type"
    t.bigint "taggable_id"
    t.index ["taggable_type", "taggable_id"], name: "index_concepts_on_taggable_type_and_taggable_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.string "description"
  end

  create_table "groups_questions", id: false, force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "question_id", null: false
    t.index ["group_id", "question_id"], name: "index_groups_questions_on_group_id_and_question_id"
  end

  create_table "groups_response_sets", id: false, force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "response_set_id", null: false
    t.index ["group_id", "response_set_id"], name: "index_groups_response_sets_on_group_id_and_response_set_id"
  end

  create_table "groups_sections", id: false, force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "section_id", null: false
    t.index ["group_id", "section_id"], name: "index_groups_sections_on_group_id_and_section_id"
  end

  create_table "groups_surveys", id: false, force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "survey_id", null: false
    t.index ["group_id", "survey_id"], name: "index_groups_surveys_on_group_id_and_survey_id"
  end

  create_table "groups_users", id: false, force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "user_id", null: false
    t.index ["group_id", "user_id"], name: "index_groups_users_on_group_id_and_user_id"
  end

  create_table "import_sessions", force: :cascade do |t|
    t.binary "spreadsheet"
    t.string "import_errors", array: true
    t.string "original_filename"
    t.boolean "request_survey_creation"
    t.integer "top_level_sections"
    t.integer "created_by_id"
    t.integer "survey_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "import_warnings", array: true
  end

  create_table "notifications", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "url"
    t.string "message"
    t.boolean "read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "question_response_sets", id: :serial, force: :cascade do |t|
    t.integer "question_id"
    t.integer "response_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "questions", id: :serial, force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "created_by_id"
    t.integer "updated_by_id"
    t.string "version_independent_id"
    t.integer "version", default: 1
    t.integer "response_type_id"
    t.string "oid"
    t.text "description"
    t.string "status", default: "draft"
    t.integer "parent_id"
    t.boolean "other_allowed"
    t.integer "published_by_id"
    t.bigint "subcategory_id"
    t.bigint "category_id"
    t.boolean "preferred"
    t.integer "duplicates_replaced_count", default: 0
    t.string "data_collection_methods", default: [], array: true
    t.string "content_stage", default: "Draft"
    t.integer "duplicate_of"
    t.index ["category_id"], name: "index_questions_on_category_id"
    t.index ["created_by_id"], name: "index_questions_on_created_by_id"
    t.index ["response_type_id"], name: "index_questions_on_response_type_id"
    t.index ["subcategory_id"], name: "index_questions_on_subcategory_id"
    t.index ["updated_by_id"], name: "index_questions_on_updated_by_id"
  end

  create_table "response_sets", id: :serial, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "oid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "created_by_id"
    t.integer "updated_by_id"
    t.string "version_independent_id"
    t.integer "version", default: 1
    t.integer "parent_id"
    t.string "status", default: "draft"
    t.string "source", default: "local"
    t.integer "published_by_id"
    t.boolean "preferred"
    t.integer "duplicates_replaced_count", default: 0
    t.string "content_stage", default: "Draft"
    t.integer "duplicate_of"
    t.index ["created_by_id"], name: "index_response_sets_on_created_by_id"
    t.index ["updated_by_id"], name: "index_response_sets_on_updated_by_id"
  end

  create_table "response_types", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "code"
    t.text "description"
  end

  create_table "responses", id: :serial, force: :cascade do |t|
    t.text "value"
    t.integer "response_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "code_system"
    t.string "display_name"
    t.index ["response_set_id"], name: "index_responses_on_response_set_id"
  end

  create_table "roles", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.integer "resource_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
  end

  create_table "section_nested_items", id: :serial, force: :cascade do |t|
    t.integer "section_id"
    t.integer "question_id"
    t.integer "response_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position"
    t.string "program_var"
    t.bigint "nested_section_id"
    t.index ["nested_section_id"], name: "index_section_nested_items_on_nested_section_id"
  end

  create_table "sections", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "created_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "version_independent_id"
    t.integer "version", default: 1
    t.string "oid"
    t.text "description"
    t.string "status", default: "draft"
    t.integer "published_by_id"
    t.integer "parent_id"
    t.boolean "preferred"
    t.string "content_stage", default: "Draft"
    t.index ["created_by_id"], name: "index_sections_on_created_by_id"
  end

  create_table "subcategories", force: :cascade do |t|
    t.string "name"
    t.bigint "category_id"
    t.index ["category_id"], name: "index_subcategories_on_category_id"
  end

  create_table "surveillance_programs", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "acronym"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_surveillance_programs_on_name", unique: true
  end

  create_table "surveillance_systems", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "acronym"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_surveillance_systems_on_name", unique: true
  end

  create_table "survey_sections", id: :serial, force: :cascade do |t|
    t.integer "survey_id"
    t.integer "section_id"
    t.integer "position"
  end

  create_table "surveys", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "created_by_id"
    t.string "version_independent_id"
    t.integer "version", default: 1
    t.string "control_number", limit: 9
    t.string "status", default: "draft"
    t.string "description"
    t.integer "surveillance_program_id"
    t.integer "surveillance_system_id"
    t.integer "published_by_id"
    t.integer "parent_id"
    t.boolean "preferred"
    t.date "omb_approval_date"
    t.string "content_stage", default: "Draft"
    t.index ["created_by_id"], name: "index_surveys_on_created_by_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "provider"
    t.string "uid"
    t.string "first_name"
    t.string "last_name"
    t.integer "last_program_id"
    t.integer "last_system_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.text "object_changes"
    t.string "comment"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "authentications", "users"
  add_foreign_key "questions", "categories"
  add_foreign_key "questions", "response_types"
  add_foreign_key "questions", "subcategories"
  add_foreign_key "questions", "users", column: "created_by_id"
  add_foreign_key "questions", "users", column: "published_by_id"
  add_foreign_key "questions", "users", column: "updated_by_id"
  add_foreign_key "response_sets", "users", column: "created_by_id"
  add_foreign_key "response_sets", "users", column: "published_by_id"
  add_foreign_key "response_sets", "users", column: "updated_by_id"
  add_foreign_key "responses", "response_sets"
  add_foreign_key "sections", "users", column: "created_by_id"
  add_foreign_key "sections", "users", column: "published_by_id"
  add_foreign_key "subcategories", "categories"
  add_foreign_key "surveys", "surveillance_programs"
  add_foreign_key "surveys", "surveillance_systems"
  add_foreign_key "surveys", "users", column: "created_by_id"
  add_foreign_key "surveys", "users", column: "published_by_id"
  add_foreign_key "users", "surveillance_programs", column: "last_program_id"
  add_foreign_key "users", "surveillance_systems", column: "last_system_id"
end
