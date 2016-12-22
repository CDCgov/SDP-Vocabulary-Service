# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Setup single user for testing:
ResponseType.create name: 'Response Set'
ResponseType.create name: 'Free Text'
ResponseType.create name: 'Date'
ResponseType.create name: 'Integer'
ResponseType.create name: 'Decimal'
