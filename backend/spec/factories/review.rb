FactoryBot.define do
  factory :review do
    user
    beer { Beer.find_in_batches.to_a.sample.sample }
    text { Faker::ChuckNorris.fact }
    rating { 1.step(by: 0.5, to: 5).to_a.sample }
  end
end