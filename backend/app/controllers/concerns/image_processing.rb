module ImageProcessing
  def decode_image(data)
    # Decodificar data, crear un StringIO o archivo temporal aquí
    # Ejemplo básico, asume que la data viene como 'data:image/jpeg;base64,...'
    header, data = data.split(',')
    content_type, encoding = header.split(';').first.split(':').last.split('/')
    filename = "upload.#{content_type}"
    {
      io: StringIO.new(Base64.decode64(data)),
      filename: filename,
      content_type: "image/#{content_type}"
    }
  end 
end