FactoryBot.define do
  factory :beer do
    brand
    name { Faker::Beer.name }
    style { Faker::Beer.style }
    hop { Faker::Beer.hop }
    yeast { Faker::Beer.yeast }
    malts { Faker::Beer.malts }
    ibu { Faker::Beer.ibu }
    alcohol { Faker::Beer.alcohol }
    blg { Faker::Beer.blg }

    factory :beer_with_reviews do
      transient do
        review_count { Faker::Number.normal(mean: 50, standard_deviation: 12.5).to_i }
      end

      after(:create) do |beer, evaluator|
        create_list(:review, evaluator.review_count, beer: beer)
      end
    end
  end
end