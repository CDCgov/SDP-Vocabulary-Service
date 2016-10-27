module FormsHelper
  def link_to_add_question(name, _f, _question)
    render(
      html: ('<a class=btn onclick="alert(\'It worked!\')"> ' + name + ' </a>').html_safe
    )
  end
end
