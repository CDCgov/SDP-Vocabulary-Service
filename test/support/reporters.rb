# Minitest::Reporters adds color and progress bar to the test runner
require 'minitest/reporters'
Minitest::Reporters.use!(
  [Minitest::Reporters::HtmlReporter.new(reports_dir: 'reports/mini_test'),
   Minitest::Reporters::DefaultReporter.new(color: true)],
  ENV,
  Minitest.backtrace_filter
)
