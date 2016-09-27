# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Setup single user for testing:
user = User.new
user.email = "test_author@gmail.com"
user.password = "password"
user.save
ability = Ability.new(user)

# Simple demo questions:
q1 = Question.create(content: "What is your gender?", author: user.email)
q2 = Question.create(content: "What is another question example?", author: user.email)