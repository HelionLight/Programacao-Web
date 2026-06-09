const tokenKey = "crudMundoToken";
const loginSection = document.getElementById("loginSection") as HTMLElement;
const appSection = document.getElementById("appSection") as HTMLElement;
const formsSection = document.getElementById("formsSection") as HTMLElement;
const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const loginEmail = document.getElementById("loginEmail") as HTMLInputElement;
const loginPassword = document.getElementById("loginPassword") as HTMLInputElement;
const loginMessage = document.getElementById("loginMessage") as HTMLElement;
const logoutButton = document.getElementById("logoutButton") as HTMLButtonElement;
const showContinentFormButton = document.getElementById("showContinentForm") as HTMLButtonElement;
const showCountryFormButton = document.getElementById("showCountryForm") as HTMLButtonElement;
const showCityFormButton = document.getElementById("showCityForm") as HTMLButtonElement;
const closeFormsButton = document.getElementById("closeForms") as HTMLButtonElement;

const continentList = document.getElementById("continentList") as HTMLElement;
const countryList = document.getElementById("countryList") as HTMLElement;
const cityList = document.getElementById("cityList") as HTMLElement;
const countryPagination = document.getElementById("countryPagination") as HTMLElement;
const cityPagination = document.getElementById("cityPagination") as HTMLElement;

const countryContinentFilter = document.getElementById("countryContinentFilter") as HTMLSelectElement;
const cityContinentFilter = document.getElementById("cityContinentFilter") as HTMLSelectElement;
const cityCountryFilter = document.getElementById("cityCountryFilter") as HTMLSelectElement;

const countryContinentSelect = document.getElementById("countryContinentSelect") as HTMLSelectElement;
const cityCountrySelect = document.getElementById("cityCountrySelect") as HTMLSelectElement;

const continentForm = document.getElementById("continentForm") as HTMLFormElement;
const continentFormTitle = document.getElementById("continentFormTitle") as HTMLElement;
const continentIdInput = document.getElementById("continentId") as HTMLInputElement;
const continentNameInput = document.getElementById("continentName") as HTMLInputElement;
const continentDescriptionInput = document.getElementById("continentDescription") as HTMLTextAreaElement;
const continentMessage = document.getElementById("continentMessage") as HTMLElement;

const countryForm = document.getElementById("countryForm") as HTMLFormElement;
const countryFormTitle = document.getElementById("countryFormTitle") as HTMLElement;
const countryIdInput = document.getElementById("countryId") as HTMLInputElement;
const countryNameInput = document.getElementById("countryName") as HTMLInputElement;
const countryPopulationInput = document.getElementById("countryPopulation") as HTMLInputElement;
const countryLanguageInput = document.getElementById("countryLanguage") as HTMLInputElement;
const countryCurrencyInput = document.getElementById("countryCurrency") as HTMLInputElement;
const countryMessage = document.getElementById("countryMessage") as HTMLElement;

const cityForm = document.getElementById("cityForm") as HTMLFormElement;
const cityFormTitle = document.getElementById("cityFormTitle") as HTMLElement;
const cityIdInput = document.getElementById("cityId") as HTMLInputElement;
const cityNameInput = document.getElementById("cityName") as HTMLInputElement;
const cityPopulationInput = document.getElementById("cityPopulation") as HTMLInputElement;
const cityLatitudeInput = document.getElementById("cityLatitude") as HTMLInputElement;
const cityLongitudeInput = document.getElementById("cityLongitude") as HTMLInputElement;
const cityMessage = document.getElementById("cityMessage") as HTMLElement;

const countrySearchInput = document.getElementById("countrySearchInput") as HTMLInputElement;
const weatherSearchInput = document.getElementById("weatherSearchInput") as HTMLInputElement;
const countrySearchButton = document.getElementById("countrySearchButton") as HTMLButtonElement;
const weatherSearchButton = document.getElementById("weatherSearchButton") as HTMLButtonElement;
const countryExternalResult = document.getElementById("countryExternalResult") as HTMLElement;
const weatherExternalResult = document.getElementById("weatherExternalResult") as HTMLElement;

let currentCountryPage = 1;
let currentCityPage = 1;

function getToken(): string | null {
  return localStorage.getItem(tokenKey);
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function showMessage(element: HTMLElement, message: string, isError = true) {
  element.textContent = message;
  element.classList.toggle("error", isError);
  element.classList.toggle("success", !isError);
}

function hideMessage(element: HTMLElement) {
  element.textContent = "";
  element.classList.remove("error", "success");
}

async function requestJson(url: string, init: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const auth = getAuthHeaders();
  if (auth.Authorization) {
    headers.Authorization = auth.Authorization;
  }
  if (init.headers) {
    Object.assign(headers, init.headers as Record<string, string>);
  }

  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || response.statusText || "Erro de rede");
  }
  return response.json();
}

async function login(event: Event) {
  event.preventDefault();
  hideMessage(loginMessage);
  try {
    const response = await requestJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value,
      }),
    });

    localStorage.setItem(tokenKey, response.token);
    showApp();
  } catch (error) {
    showMessage(loginMessage, String(error));
  }
}

function logout() {
  localStorage.removeItem(tokenKey);
  window.location.reload();
}

function openForms() {
  formsSection.classList.remove("hidden");
}

function closeForms() {
  formsSection.classList.add("hidden");
  continentForm.classList.add("hidden");
  countryForm.classList.add("hidden");
  cityForm.classList.add("hidden");
  hideMessage(continentMessage);
  hideMessage(countryMessage);
  hideMessage(cityMessage);
}

function openForm(form: HTMLFormElement, title: HTMLElement, titleText: string) {
  openForms();
  continentForm.classList.add("hidden");
  countryForm.classList.add("hidden");
  cityForm.classList.add("hidden");
  title.textContent = titleText;
  form.classList.remove("hidden");
}

function fillSelect(select: HTMLSelectElement, items: { id: number; name: string }[], includeEmpty = true) {
  select.innerHTML = includeEmpty ? `<option value="">Todos</option>` : "";
  for (const item of items) {
    const option = document.createElement("option");
    option.value = String(item.id);
    option.textContent = item.name;
    select.appendChild(option);
  }
}

async function loadContinents() {
  const continents = await requestJson("/api/continents");
  const html = continents
    .map((continent: any) => `
      <div class="card item-card">
        <div>
          <strong>${continent.name}</strong>
          <p>${continent.description}</p>
          <p class="meta">Países: ${continent.countries.length}</p>
        </div>
        <div class="item-actions">
          <button data-action="edit-continent" data-id="${continent.id}" class="icon-button">Editar</button>
          <button data-action="delete-continent" data-id="${continent.id}" class="icon-button danger">Excluir</button>
        </div>
      </div>
    `)
    .join("");
  continentList.innerHTML = html || "<p class='empty'>Nenhum continente cadastrado.</p>";

  fillSelect(countryContinentFilter, continents);
  fillSelect(cityContinentFilter, continents);
  fillSelect(countryContinentSelect, continents, false);
}

async function loadCountries(page = 1) {
  currentCountryPage = page;
  const continentId = countryContinentFilter.value;
  const query = new URLSearchParams({ page: String(page), limit: "8" });
  if (continentId) query.set("continentId", continentId);

  const data = await requestJson(`/api/countries?${query.toString()}`);
  const countries = data.countries || [];
  const html = countries
    .map((country: any) => `
      <div class="card item-card">
        <div>
          <strong>${country.name}</strong>
          <p>População: ${country.population.toLocaleString()}</p>
          <p>Idioma: ${country.officialLanguage}</p>
          <p>Moeda: ${country.currency}</p>
          <p>Continente: ${country.continent.name}</p>
          <p>Cidades: ${country.cities.length}</p>
        </div>
        <div class="item-actions">
          <button data-action="edit-country" data-id="${country.id}" class="icon-button">Editar</button>
          <button data-action="delete-country" data-id="${country.id}" class="icon-button danger">Excluir</button>
        </div>
      </div>
    `)
    .join("");
  countryList.innerHTML = html || "<p class='empty'>Nenhum país encontrado.</p>";

  renderPagination(countryPagination, data.page, data.total, data.limit, loadCountries);
  await loadCountrySelect();
}

async function loadCities(page = 1) {
  currentCityPage = page;
  const continentId = cityContinentFilter.value;
  const countryId = cityCountryFilter.value;
  const query = new URLSearchParams({ page: String(page), limit: "10" });
  if (continentId) query.set("continentId", continentId);
  if (countryId) query.set("countryId", countryId);

  const data = await requestJson(`/api/cities?${query.toString()}`);
  const cities = data.cities || [];
  const html = cities
    .map((city: any) => `
      <div class="card item-card">
        <div>
          <strong>${city.name}</strong>
          <p>População: ${city.population.toLocaleString()}</p>
          <p>Lat/Long: ${city.latitude.toFixed(6)}, ${city.longitude.toFixed(6)}</p>
          <p>País: ${city.country.name}</p>
          <p>Continente: ${city.country.continent.name}</p>
        </div>
        <div class="item-actions">
          <button data-action="edit-city" data-id="${city.id}" class="icon-button">Editar</button>
          <button data-action="delete-city" data-id="${city.id}" class="icon-button danger">Excluir</button>
        </div>
      </div>
    `)
    .join("");
  cityList.innerHTML = html || "<p class='empty'>Nenhuma cidade encontrada.</p>";

  renderPagination(cityPagination, data.page, data.total, data.limit, loadCities);
}

function renderPagination(container: HTMLElement, page: number, total: number, limit: number, callback: (page: number) => void) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const buttons = [];
  for (let index = 1; index <= pages; index += 1) {
    buttons.push(
      `<button class="pagination-button${index === page ? " active" : ""}" data-page="${index}">${index}</button>`
    );
  }
  container.innerHTML = buttons.join("");
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => callback(Number((button as HTMLElement).dataset.page)));
  });
}

async function loadCountrySelect() {
  const data = await requestJson("/api/countries?limit=100");
  const countries = data.countries || [];
  fillSelect(cityCountrySelect, countries, false);
  fillSelect(cityCountryFilter, countries);
}

function showApp() {
  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  closeForms();
  loadContinents();
  loadCountries(1).catch(console.error);
  loadCities(1).catch(console.error);
}

async function saveContinent(event: Event) {
  event.preventDefault();
  hideMessage(continentMessage);
  const id = continentIdInput.value;
  const data = {
    name: continentNameInput.value.trim(),
    description: continentDescriptionInput.value.trim(),
  };

  try {
    if (id) {
      await requestJson(`/api/continents/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      showMessage(continentMessage, "Continente atualizado com sucesso.", false);
    } else {
      await requestJson("/api/continents", { method: "POST", body: JSON.stringify(data) });
      showMessage(continentMessage, "Continente criado com sucesso.", false);
    }
    await loadContinents();
  } catch (error) {
    showMessage(continentMessage, String(error));
  }
}

async function saveCountry(event: Event) {
  event.preventDefault();
  hideMessage(countryMessage);
  const id = countryIdInput.value;
  const data = {
    name: countryNameInput.value.trim(),
    population: Number(countryPopulationInput.value),
    officialLanguage: countryLanguageInput.value.trim(),
    currency: countryCurrencyInput.value.trim(),
    continentId: Number(countryContinentSelect.value),
  };

  try {
    if (!data.continentId) {
      throw new Error("Escolha um continente para este país.");
    }
    if (id) {
      await requestJson(`/api/countries/${id}`, { method: "PUT", body: JSON.stringify(data) });
      showMessage(countryMessage, "País atualizado com sucesso.", false);
    } else {
      await requestJson("/api/countries", { method: "POST", body: JSON.stringify(data) });
      showMessage(countryMessage, "País criado com sucesso.", false);
    }
    await loadCountries(currentCountryPage);
    await loadContinents();
    await loadCountrySelect();
  } catch (error) {
    showMessage(countryMessage, String(error));
  }
}

async function saveCity(event: Event) {
  event.preventDefault();
  hideMessage(cityMessage);
  const id = cityIdInput.value;
  const data = {
    name: cityNameInput.value.trim(),
    population: Number(cityPopulationInput.value),
    latitude: Number(cityLatitudeInput.value),
    longitude: Number(cityLongitudeInput.value),
    countryId: Number(cityCountrySelect.value),
  };

  try {
    if (!data.countryId) {
      throw new Error("Escolha um país para esta cidade.");
    }
    if (id) {
      await requestJson(`/api/cities/${id}`, { method: "PUT", body: JSON.stringify(data) });
      showMessage(cityMessage, "Cidade atualizada com sucesso.", false);
    } else {
      await requestJson("/api/cities", { method: "POST", body: JSON.stringify(data) });
      showMessage(cityMessage, "Cidade criada com sucesso.", false);
    }
    await loadCities(currentCityPage);
  } catch (error) {
    showMessage(cityMessage, String(error));
  }
}

function openContinentEditor(continent: any) {
  openForm(continentForm, continentFormTitle, "Editar Continente");
  continentIdInput.value = String(continent.id);
  continentNameInput.value = continent.name;
  continentDescriptionInput.value = continent.description;
}

function openCountryEditor(country: any) {
  openForm(countryForm, countryFormTitle, "Editar País");
  countryIdInput.value = String(country.id);
  countryNameInput.value = country.name;
  countryPopulationInput.value = String(country.population);
  countryLanguageInput.value = country.officialLanguage;
  countryCurrencyInput.value = country.currency;
  countryContinentSelect.value = String(country.continentId);
}

function openCityEditor(city: any) {
  openForm(cityForm, cityFormTitle, "Editar Cidade");
  cityIdInput.value = String(city.id);
  cityNameInput.value = city.name;
  cityPopulationInput.value = String(city.population);
  cityLatitudeInput.value = String(city.latitude);
  cityLongitudeInput.value = String(city.longitude);
  cityCountrySelect.value = String(city.countryId);
}

async function deleteItem(endpoint: string, id: string, reload: () => void) {
  if (!confirm("Deseja realmente excluir este item?")) {
    return;
  }
  try {
    await requestJson(`${endpoint}/${id}`, { method: "DELETE" });
    reload();
  } catch (error) {
    alert(String(error));
  }
}

async function queryExternalCountry() {
  countryExternalResult.textContent = "Buscando...";
  try {
    const code = countrySearchInput.value.trim();
    if (!code) {
      throw new Error("Informe o código ISO do país.");
    }
    const data = await requestJson(`/api/external/country/${code}`);
    const currencies = data.currencies ? Object.keys(data.currencies).join(", ") : "N/A";
    const languages = data.languages ? Object.values(data.languages).join(", ") : "N/A";
    countryExternalResult.innerHTML = `
      <div class="external-card">
        <img src="${data.flags?.svg || data.flags?.png}" alt="Bandeira ${data.name.common}" />
        <div>
          <h4>${data.name.common} (${data.cca2})</h4>
          <p>Continente: ${data.region}</p>
          <p>Capital: ${data.capital?.[0] || "N/A"}</p>
          <p>Moedas: ${currencies}</p>
          <p>Idiomas: ${languages}</p>
          <p>População: ${Number(data.population).toLocaleString()}</p>
        </div>
      </div>
    `;
  } catch (error) {
    countryExternalResult.textContent = String(error);
  }
}

async function queryExternalWeather() {
  weatherExternalResult.textContent = "Buscando...";
  try {
    const city = weatherSearchInput.value.trim();
    if (!city) {
      throw new Error("Informe o nome da cidade.");
    }
    const data = await requestJson(`/api/external/weather/${encodeURIComponent(city)}`);
    weatherExternalResult.innerHTML = `
      <div class="external-card">
        <div>
          <h4>${data.name}, ${data.sys?.country || ""}</h4>
          <p>${data.weather?.[0]?.description || "Sem descrição"}</p>
          <p>Temperatura: ${Math.round(data.main?.temp)}°C</p>
          <p>Sensação: ${Math.round(data.main?.feels_like)}°C</p>
          <p>Umidade: ${data.main?.humidity}%</p>
          <p>Vento: ${data.wind?.speed} m/s</p>
        </div>
      </div>
    `;
  } catch (error) {
    weatherExternalResult.textContent = String(error);
  }
}

function bindListEvents() {
  continentList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;
    if (action === "edit-continent") {
      const continent = await requestJson(`/api/continents/${id}`);
      openContinentEditor(continent);
      return;
    }
    if (action === "delete-continent") {
      await deleteItem("/api/continents", id, loadContinents);
      return;
    }
  });

  countryList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;
    if (action === "edit-country") {
      const country = await requestJson(`/api/countries/${id}`);
      openCountryEditor(country);
      return;
    }
    if (action === "delete-country") {
      await deleteItem("/api/countries", id, () => loadCountries(currentCountryPage));
      return;
    }
  });

  cityList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;
    if (action === "edit-city") {
      const city = await requestJson(`/api/cities/${id}`);
      openCityEditor(city);
      return;
    }
    if (action === "delete-city") {
      await deleteItem("/api/cities", id, () => loadCities(currentCityPage));
      return;
    }
  });
}

async function refreshData() {
  await loadContinents();
  await loadCountries(currentCountryPage);
  await loadCities(currentCityPage);
}

function initializeUi() {
  if (getToken()) {
    showApp();
  }
  loginForm?.addEventListener("submit", login);
  logoutButton?.addEventListener("click", logout);
  showContinentFormButton?.addEventListener("click", () => {
    continentForm.reset();
    continentIdInput.value = "";
    openForm(continentForm, continentFormTitle, "Cadastrar Continente");
  });
  showCountryFormButton?.addEventListener("click", async () => {
    countryForm.reset();
    countryIdInput.value = "";
    await loadContinents();
    openForm(countryForm, countryFormTitle, "Cadastrar País");
  });
  showCityFormButton?.addEventListener("click", async () => {
    cityForm.reset();
    cityIdInput.value = "";
    await loadCountrySelect();
    openForm(cityForm, cityFormTitle, "Cadastrar Cidade");
  });
  closeFormsButton?.addEventListener("click", closeForms);
  continentForm?.addEventListener("submit", saveContinent);
  countryForm?.addEventListener("submit", saveCountry);
  cityForm?.addEventListener("submit", saveCity);
  countryContinentFilter?.addEventListener("change", () => loadCountries(1));
  cityContinentFilter?.addEventListener("change", () => {
    loadCountrySelect();
    loadCities(1);
  });
  cityCountryFilter?.addEventListener("change", () => loadCities(1));
  countrySearchButton?.addEventListener("click", queryExternalCountry);
  weatherSearchButton?.addEventListener("click", queryExternalWeather);
  bindListEvents();
}

initializeUi();
