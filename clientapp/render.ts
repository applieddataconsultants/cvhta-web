export default function render(
  members: GeoJSON.FeatureCollection,
  partners: GeoJSON.FeatureCollection
) {
  let membersEl = document.getElementById('members')!
  let html = ''

  for (let member of members.features) {
    html += `
      <div class="col-md-3">
        <div class="cvhta-company">
            <div class="cvhta-company-logo">
              <div class="photo">
                <img class="img-responsive" src="${member.properties!.logo}"/>
              </div>
            </div>

            <div class="cvhta-company-info">
              <h3><a href="${member.properties!.url}">${member.properties!.name}</a></h3>
              <p>${member.properties!.description}</p>
            </div>
        </div>
      </div>
    `
  }
  membersEl.innerHTML = html

  let partnersEl = document.getElementById('partners-list')!
  html = ''
  for (let partner of partners.features) {
    html += `
      <div class="col-md-2">
        <div class="cvhta-partner">
          <a href="${partner.properties!.url}">
            <img
              class="img-responsive"
              src="${partner.properties!.logo}"
              title="${partner.properties!.name}"
            />
          </a>
        </div>
      </div>
    `
  }
  partnersEl.innerHTML = html

  document.getElementById('today')!.innerHTML = String(new Date().getFullYear())
}
