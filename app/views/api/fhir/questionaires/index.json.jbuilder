json.resourceType  'Bundle'
json.type 'searchset'
json.entry do
  json.array! @surveys do |survey|
    json.partial! 'show', survey: survey
  end
end
