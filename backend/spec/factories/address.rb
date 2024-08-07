FactoryBot.define do
  factory :address do
    user
    # Asegura que cada dirección tenga un país asociado.
    country { create(:country) } 
    line1 { "123 Main St" }
    line2 { "Some place" }
    city { "Anytown" }
  end
end