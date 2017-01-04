# Be sure to restart your server when you modify this file.

# Prefix for generated oids
Rails.application.config.oid_prefix = '2.16.840.1.113883.3.1502'
# Prefixes for different types that are classified within the above oid
# results in oid that looks like: <oid_prefix>.<class_prefix>
Rails.application.config.oid_object_prefixes = {  Form: '1',
                                                  Question: '2',
                                                  ResponseSet: '3' }
