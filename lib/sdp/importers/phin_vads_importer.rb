require_relative '../../ext/hessian'
require_relative '../../ext/hash'
module SDP
  module Importers
    class PhinVadsImporter
      DEFAULTS = { vads_uri: 'https://phinvads.cdc.gov/vocabService/v2',
                   limit: 1000,
                   max_vs_length: 100,
                   user_latest: true ,
                   proxy: {}}.freeze
      RS_STATUS_MAPPING = { 'Un-Published' => 'draft', 'Published' => 'published', 'Retired' => 'deprecated' }.freeze
      def initialize(args = {})
        @params = DEFAULTS.merge(args)
        puts 'Initializing PhinVadsImporter with params:'
        puts @params
      end

      attr_reader :params

      # Sync all of the valuesets and all of the versions into the system
      def import_valuesets
        logger.debug 'Sync valuesets '
        # get all of the versions and valuesets and map them together
        # this is cleaner and easier than getting the vs and the getting all of it's versions
        # separately
        valuesets = vads_client.getAllValueSets.getValueSets
        versions = vads_client.getAllValueSetVersions.getValueSetVersions
        temp = {}
        logger.debug
        valuesets.each do |vs|
          temp[vs.oid] = { valueset: vs, versions: [] }
        end

        versions.each do |ver|
          temp[ver.valueSetOid][:versions] << ver
        end
        @valuesets = temp.values
        @valuesets.each do |vs|
          logger.debug "working valueset #{vs[:valueset].name}"
          import_versions(vs)
        end
      end

      # Import the versions of a valueset into the system
      def import_versions(vs)
        logger.debug 'updating valueset versions '
        vset = vs[:valueset]
        versions = vs[:versions] || []
        versions.sort! { |a, b| a.versionNumber <=> b.versionNumber }
        versions = [versions.last] if params[:use_latest]
        versions.each do |ver|
          create_vs_and_responses(vset, ver)
        end
      end

      # Import a valueset from PHIN VADS into the system
      def import_valueset(oid)
        vset = vads_client.getValueSetByOid(oid).getValueSet
        vset = vset[0]
        versions = vads_client.getValueSetVersionsByValueSetOid(oid).getValueSetVersions
        versions.sort! { |a, b| a.versionNumber <=> b.versionNumber }
        versions.each do |ver|
          create_vs_and_responses(vset, ver)
        end
      end

      # Create a new ResponseSet set based on the the PHIN VADS Valueset and Version
      def create_vs_and_responses(vset, ver)
        # make sure it doesn't exist yet
        rset = ResponseSet.where(oid: vset.oid, version: ver.versionNumber).first
        if rset && !params[:force_reload]
          logger.debug "Valueset #{vset.oid} version: #{ver.versionNumber} already exists in systems "
        elsif rset && params[:force_reload]
          rset.responses = []
          import_valueset_codes(rset, ver.id)
          rset.save
        else
          prev = ResponseSet.where(oid: vset.oid, version: ver.versionNumber - 1).first
          # are there already response sets in the db for the valueset oid
          status = RS_STATUS_MAPPING[ver.status] || 'draft'
          # need to force encode name and definitionText fields due to the way the hessian lib works
          # some ugly chars come across in the fields at times and need to be dealt with before
          # saving to the database
          rset = ResponseSet.new(name: (vset.name || '').force_encoding('ISO-8859-1').encode('UTF-8').delete("\u0000"),
                                 description: (vset.definitionText || '').force_encoding('ISO-8859-1').encode('UTF-8').delete("\u0000"),
                                 parent_id: nil,
                                 oid: vset.oid.delete("\u0000"),
                                 version: ver.versionNumber,
                                 status: status.delete("\u0000"),
                                 created_by: user,
                                 parent: prev,
                                 version_independent_id: prev ? prev.version_independent_id : nil,
                                 source: 'PHIN_VADS')
          import_valueset_codes(rset, ver.id)
          rset.save
        end
        rset
      end

      # Import the codes for a phinvads valueset/version into a ResponseSet
      # The codes will be added to the responseSet if the number of vads codes
      # are less then or equal to the max_vs_length field in the parameters used
      # too create the importer.  the default is 100 which covers ~1350 out of ~1550
      # valuesets.  If the codes are not imported the ResponseSet will still be
      # added to the systems just no codes will be contained in it
      def import_valueset_codes(rset, version_id)
        start = Time.now
        count = 0
        page = 0
        limit = params[:limit] < params[:max_vs_length] ? params[:max_vs_length] : params[:limit]
        loop do
          dto = vads_client.getValueSetConceptsByValueSetVersionId(version_id, (page += 1), limit)
          if dto.getTotalResults > params[:max_vs_length]
            puts 'Valueset has greater than 100 values'
          end
          length = dto.getValueSetConcepts ? dto.getValueSetConcepts.length : 0
          logger.debug "getting vs codes #{count} to #{count + length} of #{dto.getTotalResults} "
          count += length
          dto.getValueSetConcepts.each do |code|
            rset.responses << Response.new(value: code.conceptCode.delete("\u0000"),
                                           code_system: code.codeSystemOid.delete("\u0000"),
                                           display_name: (code.codeSystemConceptName || '').force_encoding('ISO-8859-1').encode('UTF-8').delete("\u0000"))
          end
          break if count >= dto.getTotalResults
        end
        logger.debug "Took #{Time.now - start}"
      end

      def user
        params[:user]
      end

      def vads_client
        puts 'Establishing vads client and fetching batch with proxy:'
        puts params[:proxy]
        @vads_client ||= Hessian::HessianClient.new(params[:vads_uri], params[:proxy] || {})
      end

      def logger
        Rails.logger
      end
    end
  end
end
