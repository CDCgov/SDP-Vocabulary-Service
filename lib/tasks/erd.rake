desc 'Generate Entity Relationship Diagram'
task generate_erd: :environment do
  system 'erd --inheritance --filetype=dot --notation=uml --orientation=vertical --title= --attributes=foreign_keys,content'
  system 'dot -Tpng erd.dot > erd.png'
  File.delete('erd.dot')
  File.open('.current_erd', 'w') do |f|
    f.puts ActiveRecord::Migrator.current_version
  end
end

namespace :erd do
  task test: :environment do
    current_erd = File.read('.current_erd').strip!
    current_schema = ActiveRecord::Migrator.current_version.to_s
    if current_erd != current_schema
      raise "ERD Diagram out of date:
            ERD generated against schemm version #{current_erd}
            Current Schema version #{current_schema}
            Run rake generate_erd to rectify  "
    end
  end
end
