# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Setup single user for testing:
user = User.new
user.email = 'test_author@gmail.com'
user.password = 'password'
user.save
Ability.new(user)

# Use `rake db:seed questionSeed=yes` to seed
if ENV['questionSeed']
  Question.create(content: 'What is your gender?', author: user.email)
  Question.create(content: 'What is another question example?', author: user.email)
end

# Use `rake db:seed responseSeed=yes` to populate
if ENV['responseSeed']
  rs1 = ResponseSet.create(name: 'Gender Partial', description: 'M / F', author: user.email)
  rs2 = ResponseSet.create(name: 'Gender Full', description: 'Male / Female / Prefer not to answer', author: user.email)

  Response.create(value: 'M', response_set_id: rs1.id)
  Response.create(value: 'F', response_set_id: rs1.id)
  Response.create(value: 'Male', response_set_id: rs2.id)
  Response.create(value: 'Female', response_set_id: rs2.id)
  Response.create(value: 'Prefer not to answer', response_set_id: rs2.id)
end
