json.resourceType 'Bundle'
json.type 'searchset'
json.entry do
  json.array! @value_sets do |value_set|
    json.partial! 'show', value_set: value_set
  end
end
