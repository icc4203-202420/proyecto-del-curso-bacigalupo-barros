# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_07_151749) do
  create_table "addresses", force: :cascade do |t|
    t.string "line1"
    t.string "line2"
    t.string "city"
    t.integer "country_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_addresses_on_country_id"
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "beers", force: :cascade do |t|
    t.string "beer_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "brand_id"
    t.string "name"
    t.string "style"
    t.string "hop"
    t.string "yeast"
    t.string "malts"
    t.string "ibu"
    t.string "alcohol"
    t.string "blg"
    t.index ["brand_id"], name: "index_beers_on_brand_id"
  end

  create_table "brands", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "brewery_id", null: false
    t.index ["brewery_id"], name: "index_brands_on_brewery_id"
  end

  create_table "breweries", force: :cascade do |t|
    t.string "name"
    t.date "estdate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "breweries_countries", id: false, force: :cascade do |t|
    t.integer "brewery_id", null: false
    t.integer "country_id", null: false
    t.index ["brewery_id", "country_id"], name: "index_breweries_countries_on_brewery_id_and_country_id"
    t.index ["country_id", "brewery_id"], name: "index_breweries_countries_on_country_id_and_brewery_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "review_counters", force: :cascade do |t|
    t.integer "count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reviews", force: :cascade do |t|
    t.text "text"
    t.decimal "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.integer "beer_id", null: false
    t.index ["beer_id"], name: "index_reviews_on_beer_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "age"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "jti", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "addresses", "countries"
  add_foreign_key "addresses", "users"
  add_foreign_key "beers", "brands"
  add_foreign_key "brands", "breweries"
  add_foreign_key "reviews", "beers"
  add_foreign_key "reviews", "users"
end
