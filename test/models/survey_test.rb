require 'test_helper'

class SurveyTest < ActiveSupport::TestCase
  test 'has survey sections' do
    s = surveys(:one)
    assert_equal 2, s.survey_sections.length
  end

  test 'same OMB control number is OK across versions' do
    s = surveys(:one)
    revision = s.build_new_revision
    assert_equal 2, revision.version
    assert revision.save
    assert_equal s.control_number, revision.control_number
  end

  test 'Two surveys can have the same OMB number' do
    user = users(:admin)
    s = surveys(:one)
    s2 = Survey.new(name: 'Same OMB Survey', created_by: user, control_number: '1234-5678')
    assert s2.save
    assert_equal s.control_number, s2.control_number
  end

  test ' invalid control number should not be valid' do
    s = surveys(:one)
    s.control_number = '1234'
    assert_not s.valid?
  end

  test 'Publish also publishes sections, questions, and response sets' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test publish', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test publish', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    q.response_sets = [rs]
    assert q.save
    sect = Section.new(name: 'Test publish', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    s = Survey.new(name: 'Test publish', created_by: user)
    s.survey_sections = [SurveySection.new(section_id: sect.id, position: 0)]
    assert s.save
    s.publish(user)
    assert_equal user, s.published_by
    assert_equal 'published', s.status
    assert_equal 'published', s.sections.first.status
    assert_equal 'published', s.sections.first.questions.first.status
    assert_equal 'published', s.sections.first.questions.first.response_sets.first.status
  end

  test 'Add to group also adds sections, questions, and response sets' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test group rs', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test group q', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    q.response_sets = [rs]
    assert q.save
    sect = Section.new(name: 'Test group sect', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    s = Survey.new(name: 'Test group surv', created_by: user)
    s.survey_sections = [SurveySection.new(section_id: sect.id, position: 0)]
    assert s.save
    group = groups(:one)
    s.add_to_group(group.id)
    assert s.groups.include?(group)
    assert s.sections.first.groups.include?(group)
    assert s.sections.first.questions.first.groups.include?(group)
    assert s.sections.first.questions.first.response_sets.first.groups.include?(group)
  end

  test 'Adding a Section to a Survey that is assigned to group, will give the Section group privileges' do
    # set up a survey and assign to a group
    user = users(:admin)
    rs1 = ResponseSet.new(name: 'Test group first rs', created_by: user)
    assert rs1.save
    q1 = Question.new(content: 'Test group first q', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    q1.response_sets = [rs1]
    assert q1.save
    sect1 = Section.new(name: 'Test group first sect', created_by: user)
    sect1.section_nested_items = [SectionNestedItem.new(question_id: q1.id, response_set_id: rs1.id, position: 0)]
    assert sect1.save
    s = Survey.new(name: 'Test group surv', created_by: user)
    s.survey_sections << [SurveySection.new(survey_id: s.id, section_id: sect1.id, position: 0)]
    assert s.save
    group = groups(:one)
    s.add_to_group(group.id)
    # check that group was added correctly
    assert s.groups.include?(group)
    assert s.sections.first.groups.include?(group)
    assert s.sections.first.questions.first.groups.include?(group)
    assert s.sections.first.questions.first.response_sets.first.groups.include?(group)

    # Need to wait for the async queue to finish its work creating the section,

    # Add a new Section and new question and response set then check that group has been given to the new Section
    rs2 = ResponseSet.new(name: 'Test group second rs', created_by: user)
    assert rs2.save

    q2 = Question.new(content: 'Test group second q', response_type: ResponseType.new(name: 'choice2', code: 'choice2'), created_by: user)
    q2.response_sets = [rs2]
    assert q2.save
    sect2 = Section.new(name: 'Test group second sect ', created_by: user)
    sect2.section_nested_items = [SectionNestedItem.new(question_id: q2.id, response_set_id: rs2.id, position: 0)]
    assert sect2.save!
    s.survey_sections << [SurveySection.new(section_id: sect2.id, position: 1)]
    sect2.add_to_group(group.id)
    assert s.save!

    surv = Survey.find(s.id)

    # get the last section
    @lastsect = surv.sections.last
    # check if the newly added section has been assigned to the new group
    assert @lastsect.groups.include?(group)
    # check if the newly added question on the section has been assigned to the new group
    assert @lastsect.questions.last.groups.include?(group)
    # check if the newly added response set on the section has been assigned to the new group
    assert @lastsect.response_sets.last.groups.include?(group)

    # Test that if a Section -sect3 which has a group already assigned is added to the survey
    # that it and rs and questions will be assigned both the new group and the old groups
    group2 = groups(:two)

    rs3 = ResponseSet.new(name: 'Test group third -rs', created_by: user)
    assert rs3.save
    q3 = Question.new(content: 'Test group third - q', response_type: ResponseType.new(name: 'choice3', code: 'choice3'), created_by: user)
    q3.response_sets = [rs3]

    sect3 = Section.new(name: 'Test group third sect ', created_by: user)
    # sect3.section_nested_items << [SectionNestedItem.new(question_id: q3.id, response_set_id: rs3.id, position: 2)]
    sect3.add_to_group(group2.id)

    assert sect3.save
    sect3.add_to_group(group.id)
    assert sect3.save

    # check that section has  new group assigned
    assert sect3.groups.include?(group2)

    # Add the section to the existing surveys
    s.survey_sections << [SurveySection.new(survey_id: s.id, section_id: sect3.id, position: 2)]
    assert s.save

    surv = Survey.find(s.id)

    @lastsectnew = surv.sections.last
    # check if the newly added section has been assigned to the new group
    assert @lastsectnew.groups.include?(group)
  end

  test 'Deleting a section deletes its survey section and preserves position' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test Delete', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test Delete', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    q.response_sets = [rs]
    assert q.save
    sect1 = Section.new(name: 'Test Delete 1', created_by: user)
    assert sect1.save
    sect2 = Section.new(name: 'Test Delete 2', created_by: user)
    sect2.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert sect2.save
    sect3 = Section.new(name: 'Test Delete 3', created_by: user)
    assert sect3.save
    s = Survey.new(name: 'Test Delete', created_by: user)
    s.survey_sections = [SurveySection.new(section_id: sect1.id, position: 0), SurveySection.new(section_id: sect2.id, position: 1), SurveySection.new(section_id: sect3.id, position: 2)]
    assert s.save
    # Need to wait for the async queue to finish its work before destroying the section, or it crashes
    sleep 5
    assert sect2.destroy
    s = Survey.find(s.id)
    assert_equal 2, s.survey_sections.size
    assert_equal 0, s.survey_sections[0].position
    assert_equal 1, s.survey_sections[1].position
    assert_equal sect1.id, s.survey_sections[0].section_id
    assert_equal sect3.id, s.survey_sections[1].section_id
  end

  test 'Dupe count and dupes can run without error' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test group rs', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test group q', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    q.response_sets = [rs]
    assert q.save
    sect = Section.new(name: 'Test group sect', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    s = Survey.new(name: 'Test group surv', created_by: user)
    s.survey_sections = [SurveySection.new(section_id: sect.id, position: 0)]
    assert s.save
    dupe_count = s.q_with_dupes_count(user)
    assert_equal 0, dupe_count
    pot_dupes = s.potential_duplicates(user)
    assert_equal 0, pot_dupes.length
  end

  test 'Getting sections with most_recent loaded' do
    s = surveys(:one)
    fs = s.sections_with_most_recent
    old_section = fs.find { |sect| sect.name == 'Section 2' }
    assert_equal 1, old_section.version
    assert_equal 2, old_section.max_version
    assert_equal 2, old_section.most_recent
  end
end
