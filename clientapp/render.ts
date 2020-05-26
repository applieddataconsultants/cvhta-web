import {GeoCollection, GeoFeature} from './types'

export default function render(
  members: GeoCollection,
  partners: GeoCollection
) {
  let membersEl = document.getElementById('members') as HTMLDivElement
  let html = ''

  let byName = (a: GeoFeature, b: GeoFeature) =>
    a.properties.name > b.properties.name ? 1 : -1

  for (let member of members.features.sort(byName)) {
    html += `
      <div class="col-md-3">
        <div class="cvhta-company">
            <div class="cvhta-company-logo">
              <div class="photo">
                <img class="img-responsive" src="${member.properties.logo}"/>
              </div>
            </div>

            <div class="cvhta-company-info">
              <h3><a href="${member.properties.url}">${member.properties.name}</a></h3>
              <p>${member.properties.description}</p>
            </div>
        </div>
      </div>
    `
  }
  membersEl.innerHTML = html

  let partnersEl = document.getElementById('partners-list') as HTMLDivElement
  html = ''
  for (let partner of partners.features.sort(byName)) {
    html += `
      <div class="col-md-2">
        <div class="cvhta-partner">
          <button>
            <a href="${partner.properties.url}">
              <img
                class="img-responsive"
                src="${partner.properties.logo}"
                title="${partner.properties.name}"
              />
            </a>
          </button>
        </div>
      </div>
    `
  }
  partnersEl.innerHTML = html

  let todayEl = document.getElementById('today') as HTMLDivElement
  todayEl.innerHTML = String(new Date().getFullYear())
}
