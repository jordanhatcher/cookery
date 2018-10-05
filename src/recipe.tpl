<h1>{{recipe_name}}</h1>
{{source_authors}}
</br>
{{#source_url}}
  {{source_url}}
{{/source_url}}

</br>
{{#notes.length}}
  <h4>Notes:</h4>
{{/notes.length}}
<ul>
{{#notes}}
  <li>{{.}}</li>
{{/notes}}
</ul>

</br>
<h4>Ingredients:</h4>
<br/>
<ul>
{{#ingredients}}
  <li>{{ingredient}} {{#usda_num}}({{usda_num}}){{/usda_num}}</li>
{{/ingredients}}
</ul>

</br>
<h4>Steps:</h4>
<br/>
<ol>
{{#steps}}
  <li>{{step}}</li>
{{/steps}}
</ol>
