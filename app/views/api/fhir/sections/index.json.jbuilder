json.resourceType 'Bundle'
json.type 'searchset'
json.entry do
  json.array! @sections do |section|
    json.partial! 'show', section: section
  end
end
