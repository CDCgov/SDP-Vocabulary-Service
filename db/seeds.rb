# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Setup single user for testing:
ResponseType.find_or_create_by name: 'Response Set'
ResponseType.find_or_create_by name: 'Free Text'
ResponseType.find_or_create_by name: 'Date'
ResponseType.find_or_create_by name: 'Integer'
ResponseType.find_or_create_by name: 'Decimal'
