require 'rails_helper'

RSpec.describe "API::V1::Bars", type: :request do
  let(:valid_attributes) {
    {
      name: "Test Bar",
      address_id: create(:address).id,
      latitude: 40.7128,
      longitude: -74.0060,
      image_base64: "data:image/jpeg;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec/fixtures/files/test_image.jpg')))}"
    }
  }
  
  let(:invalid_attributes) {
    { name: nil } # Assuming name is required
  }

  describe "GET /index" do
    it "renders a successful response" do
      create(:bar)
      get api_v1_bars_path
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    let(:bar) { create(:bar) }
  
    it "renders a successful response" do
      get api_v1_bar_path(bar)
      expect(response).to be_successful
      expect(response.body).to include(bar.name)
    end
  end  

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Bar" do
        expect {
          post api_v1_bars_path, params: { bar: valid_attributes }
        }.to change(Bar, :count).by(1)
        
        expect(response).to have_http_status(:ok)
        expect(response.body).to include("Bar created successfully.")
      end
    end

    context "with invalid parameters" do
      it "does not create a new Bar" do
        expect {
          post api_v1_bars_path, params: { bar: invalid_attributes }
        }.to change(Bar, :count).by(0)
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  describe "PATCH /update" do
    let(:bar) { create(:bar) }
    let(:new_attributes) {
      { name: "Updated Bar Name" }
    }
  
    context "with valid parameters" do
      it "updates the requested bar" do
        patch api_v1_bar_path(bar), params: { bar: new_attributes }
        bar.reload
        expect(bar.name).to eq("Updated Bar Name")
        expect(response).to have_http_status(:ok)
      end
    end
  
    context "with invalid parameters" do
      it "does not update the bar" do
        original_name = bar.name
        patch api_v1_bar_path(bar), params: { bar: { name: nil } }  # assuming name is required
        bar.reload
        expect(bar.name).to eq(original_name)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  
    context "with image update" do
      it "updates the image of the bar" do
        new_image_base64 = "data:image/jpeg;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec/fixtures/files/test_bar_image.jpg')))}"
        patch api_v1_bar_path(bar), params: { bar: { image_base64: new_image_base64 } }
        expect(response).to have_http_status(:ok)
        bar.reload
        expect(bar.image.attached?).to be true
      end
    end
  end
  
  describe "DELETE /destroy" do
    let!(:bar) { create(:bar) }
  
    it "destroys the requested bar" do
      expect {
        delete api_v1_bar_path(bar)
      }.to change(Bar, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end  
end
