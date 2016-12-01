let questions = JSON.parse(document.getElementById('formqs-json').innerHTML);
let observer = null;

function emitChange() {
  observer(questions);
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }

  observer = o;
  emitChange();
}

export function add_question( el ) {
// Should we allow duplicates?
// if (questions.includes( el )) {
// throw new Error('Duplicates are not allowed.');
//  } else {
  questions.push( el );
  emitChange();
//  }
}

export function remove_question( index ) {
// If we disallowed dupes we could remove by first or last indexOf
// let index = questions.indexOf( q );
  questions.splice( index, 1);
  emitChange();
}
