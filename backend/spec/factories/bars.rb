FactoryBot.define do
  factory :bar do
    name { "MyString" }
    latitude { 1.5 }
    longitude { 1.5 }
    address { create(:address) }
  end
end
