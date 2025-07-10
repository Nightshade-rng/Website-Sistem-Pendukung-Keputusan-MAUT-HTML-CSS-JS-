        const defaultUserCarsData = [
            { id: 1, name: "Toyota Avanza", carPrice: 220000000, fuelConsumption: 15, passengerCapacity: 7, maintenanceCost: 1800000, safetyFeatures: 7 },
            { id: 2, name: "Honda Brio", carPrice: 180000000, fuelConsumption: 18, passengerCapacity: 5, maintenanceCost: 1200000, safetyFeatures: 6 },
            { id: 3, name: "Mitsubishi Xpander", carPrice: 250000000, fuelConsumption: 14, passengerCapacity: 7, maintenanceCost: 2000000, safetyFeatures: 8 },
            { id: 4, name: "Suzuki Ertiga", carPrice: 230000000, fuelConsumption: 16, passengerCapacity: 7, maintenanceCost: 1700000, safetyFeatures: 7 },
            { id: 5, name: "Daihatsu Terios", carPrice: 240000000, fuelConsumption: 13, passengerCapacity: 7, maintenanceCost: 1900000, safetyFeatures: 7 },
            { id: 6, name: "Wuling Air EV", carPrice: 250000000, fuelConsumption: 50, passengerCapacity: 4, maintenanceCost: 800000, safetyFeatures: 7 },
            { id: 7, name: "Hyundai Creta", carPrice: 300000000, fuelConsumption: 14, passengerCapacity: 5, maintenanceCost: 2200000, safetyFeatures: 8 },
            { id: 8, name: "Toyota Raize", carPrice: 240000000, fuelConsumption: 17, passengerCapacity: 5, maintenanceCost: 1500000, safetyFeatures: 7 },
            { id: 9, name: "Daihatsu Rocky", carPrice: 235000000, fuelConsumption: 17, passengerCapacity: 5, maintenanceCost: 1450000, safetyFeatures: 7 },
            { id: 10, name: "Honda WR-V", carPrice: 270000000, fuelConsumption: 16, passengerCapacity: 5, maintenanceCost: 1900000, safetyFeatures: 8 }
        ];
        const defaultCriteriaData = [
            { name: "Harga Mobil (Rp)", key: "carPrice", weight: 0.30, type: "cost", userWeight: 0.30, options: {} },
            { name: "Konsumsi BBM (km/L)", key: "fuelConsumption", weight: 0.20, type: "benefit", userWeight: 0.20, options: {} },
            { name: "Kapasitas Penumpang (orang)", key: "passengerCapacity", weight: 0.20, type: "benefit", userWeight: 0.20, options: {} },
            { name: "Biaya Perawatan (Rp/tahun)", key: "maintenanceCost", weight: 0.15, type: "cost", userWeight: 0.15, options: {} },
            { name: "Fitur Keamanan (1-10)", key: "safetyFeatures", weight: 0.15, type: "benefit", userWeight: 0.15, options: {} }
        ];

        let cars = JSON.parse(localStorage.getItem('spk_user_cars_maut_v1')) || JSON.parse(JSON.stringify(defaultUserCarsData));
        let criteria = JSON.parse(localStorage.getItem('spk_admin_car_criteria_maut_v1')) || JSON.parse(JSON.stringify(defaultCriteriaData));
        let userHistory = JSON.parse(localStorage.getItem('spk_user_history_maut_v1')) || [];
        let rankedCarsDataForPrint = null;
        let editingCriterionKey = null;

        criteria.forEach(crit => {
            if (typeof crit.userWeight === 'undefined') {
                crit.userWeight = crit.weight;
            }
        });

        let topNavbar, mainContainer;
        let closeModalButtonJS, messageModal, modalMessageText, jsMessageDiv, jsMessageText;
        let carFormModal, closeCarFormModalButton, cancelCarFormModalButton, carForm, formCarTitle, dynamicCarCriteriaFields;
        let carId_form_js, carName_form_js;

        let showCriteriaFormButton;
        let criteriaAdminList, saveCriteriaButton, currentCriteriaSummaryTableContainer;

        let userCarsTableContainer, showUserAddCarFormButtonCP, printAdminCarListButton;
        let userHistoryContent, userHistoryTableContainer, printUserHistoryButton;

        let userCriteriaWeightsContainer, getRecommendationButton, resultsTableContainer, currentCarsInfoTableContainer;
        let recommendationTablePrintArea;

        let hamburgerButton, navLinks;
        let criteriaFormModal, closeCriteriaFormModalButton, cancelCriteriaFormModalButton, criteriaFormTitleElement;
        let newCriterionName, newCriterionKey, newCriterionType, newCriterionWeight, addNewCriterionButton;
        let currentYearElement;
        let cpHomeButton, cpRecommendationButton;
        let cpTopNavbar;

        let printRankingReportButton;


        const mobileMenuOverlayClasses = ['absolute', 'top-16', 'left-0', 'right-0', 'bg-gradient-to-r', 'from-sky-600', 'to-blue-700', 'shadow-lg', 'p-4', 'z-40', 'space-y-2', 'md:hidden'];

        function saveUserCars() {
            localStorage.setItem('spk_user_cars_maut_v1', JSON.stringify(cars));
        }
        function saveAdminCriteria() {
            localStorage.setItem('spk_admin_car_criteria_maut_v1', JSON.stringify(criteria));
        }
        function saveUserHistory() {
            localStorage.setItem('spk_user_history_maut_v1', JSON.stringify(userHistory));
        }


        function showJsModal(message, isSuccess = true) {
            if (modalMessageText && messageModal) {
                modalMessageText.textContent = message;
                modalMessageText.className = isSuccess ? 'text-lg text-blue-700' : 'text-lg text-red-700';
                messageModal.style.display = 'block';
            }
        }

        function setupModalEventListeners() {
            if (closeModalButtonJS) closeModalButtonJS.onclick = () => { if (messageModal) messageModal.style.display = 'none'; }
            window.addEventListener('click', event => {
                if (event.target == messageModal && messageModal) messageModal.style.display = 'none';
                if (event.target == carFormModal && carFormModal) hideCarFormModal();
                if (event.target == criteriaFormModal && criteriaFormModal) hideCriteriaFormModal();
            });
            if (closeCarFormModalButton) closeCarFormModalButton.addEventListener('click', hideCarFormModal);
            if (closeCriteriaFormModalButton) closeCriteriaFormModalButton.addEventListener('click', hideCriteriaFormModal);
            if (cancelCriteriaFormModalButton) cancelCriteriaFormModalButton.addEventListener('click', hideCriteriaFormModal);
        }

        function showTopBannerMessage(message, isSuccess = true) {
            if (jsMessageDiv && jsMessageText) {
                jsMessageText.textContent = message;
                jsMessageDiv.className = `mb-4 p-4 rounded-md mx-4 md:mx-8 ${isSuccess ? 'bg-sky-100 text-sky-700' : 'bg-red-100 text-red-700'}`;
                jsMessageDiv.classList.remove('hidden');
                setTimeout(() => jsMessageDiv.classList.add('hidden'), 5000);
            }
        }

        const views = document.querySelectorAll('.view');
        let navButtonElements = {};

        function showView(viewId) {
            views.forEach(view => view.classList.remove('active-view'));
            const currentViewElement = document.getElementById(viewId);
            if (currentViewElement) currentViewElement.classList.add('active-view');

            if (topNavbar && mainContainer && cpTopNavbar) {
                if (viewId === 'controlPanelView') {
                    topNavbar.classList.add('hidden');
                    cpTopNavbar.classList.remove('hidden');
                    mainContainer.classList.remove('container', 'mx-auto');
                    mainContainer.classList.add('w-full');
                } else {
                    topNavbar.classList.remove('hidden');
                    cpTopNavbar.classList.add('hidden');
                    mainContainer.classList.add('container', 'mx-auto');
                    mainContainer.classList.remove('w-full');
                }
            }

            if (viewId !== 'controlPanelView') {
                document.querySelectorAll('nav.top-navbar #navLinks button.nav-button').forEach(btn => {
                    btn.classList.remove('bg-sky-700', 'font-semibold', 'text-white');
                    btn.classList.remove('bg-blue-700');
                    if ((viewId === 'homeView' && btn.id === 'homeButton') ||
                        (viewId === 'recommendationView' && btn.id === 'recommendationButtonNav')) {
                        btn.classList.add('bg-sky-700', 'font-semibold', 'text-white');
                    }
                });
            }

            if (viewId === 'controlPanelView') {
                const activeCpSection = document.querySelector('#cpTopNavbar .cp-nav-button.active');
                if (activeCpSection && activeCpSection.dataset.content) {
                    showControlPanelContent(activeCpSection.dataset.content);
                } else {
                    const firstCpNavButton = document.querySelector('#cpTopNavbar button[data-content="userCarsManagementContent"]');
                    if (firstCpNavButton) {
                        firstCpNavButton.click();
                    } else {
                        showControlPanelContent('userCarsManagementContent');
                    }
                }
            } else if (viewId === 'recommendationView') {
                renderUserCriteriaWeights();
                updateCurrentCarsInfoTable();
                if (resultsTableContainer && (!resultsTableContainer.querySelector('table') || resultsTableContainer.textContent.includes("Hasil akan ditampilkan di sini"))) {
                    resultsTableContainer.innerHTML = '<p class="text-slate-500">Sesuaikan bobot kriteria dan klik "Dapatkan Rekomendasi". Pastikan data mobil telah ditambahkan di Control Panel.</p>';
                }
            }

            if (navLinks && navLinks.classList.contains('block') && window.innerWidth < 768) {
                navLinks.classList.add('hidden');
                navLinks.classList.remove('block', ...mobileMenuOverlayClasses.filter(c => c !== 'md:hidden'));
            }
        }

        function setupNavigationEventListeners() {
            if (navButtonElements.homeButton) navButtonElements.homeButton.addEventListener('click', () => showView('homeView'));
            if (navButtonElements.controlPanelButtonNav) navButtonElements.controlPanelButtonNav.addEventListener('click', () => showView('controlPanelView'));
            if (navButtonElements.recommendationButtonNav) navButtonElements.recommendationButtonNav.addEventListener('click', () => showView('recommendationView'));
            if (navButtonElements.goToRecommendationButtonHome) navButtonElements.goToRecommendationButtonHome.addEventListener('click', () => showView('recommendationView'));

            if (cpHomeButton) cpHomeButton.addEventListener('click', () => showView('homeView'));
            if (cpRecommendationButton) cpRecommendationButton.addEventListener('click', () => showView('recommendationView'));

            if (hamburgerButton && navLinks) {
                hamburgerButton.addEventListener('click', () => {
                    const isOpen = navLinks.classList.contains('block');
                    const blueMobileMenuOverlayClasses = ['absolute', 'top-16', 'left-0', 'right-0', 'bg-gradient-to-r', 'from-sky-600', 'to-blue-700', 'shadow-lg', 'p-4', 'z-40', 'space-y-2', 'md:hidden'];
                    if (isOpen) navLinks.classList.remove('block', ...blueMobileMenuOverlayClasses.filter(c => c !== 'md:hidden'));
                    else navLinks.classList.add('block', ...blueMobileMenuOverlayClasses.filter(c => c !== 'md:hidden'));
                    navLinks.classList.toggle('hidden');
                });
                window.addEventListener('resize', () => {
                    const blueMobileMenuOverlayClasses = ['absolute', 'top-16', 'left-0', 'right-0', 'bg-gradient-to-r', 'from-sky-600', 'to-blue-700', 'shadow-lg', 'p-4', 'z-40', 'space-y-2', 'md:hidden'];
                    if (window.innerWidth >= 768) {
                        navLinks.classList.remove('block', 'hidden', ...blueMobileMenuOverlayClasses.filter(c => c !== 'md:hidden'));
                    } else if (!navLinks.classList.contains('block')) {
                        navLinks.classList.add('hidden');
                    }
                });
            }
        }

        function showControlPanelContent(contentIdToShow) {
            document.querySelectorAll('.cp-content-section').forEach(section => {
                section.classList.remove('active-cp-content');
                section.classList.add('hidden');
            });
            const sectionToShow = document.getElementById(contentIdToShow);
            if (sectionToShow) {
                sectionToShow.classList.add('active-cp-content');
                sectionToShow.classList.remove('hidden');
            }

            document.querySelectorAll('#cpTopNavbar .cp-nav-button[data-content]').forEach(button => {
                button.classList.remove('active');
                if (button.dataset.content === contentIdToShow) button.classList.add('active');
            });

            if (contentIdToShow === 'criteriaContent') renderCurrentCriteriaSummaryTable();
            if (contentIdToShow === 'userCarsManagementContent') renderUserCarsListTable();
            if (contentIdToShow === 'userHistoryContent') renderUserHistoryTable();
        }

        function renderCurrentCriteriaSummaryTable() {
            if (!currentCriteriaSummaryTableContainer) return;
            currentCriteriaSummaryTableContainer.innerHTML = '';
            if (criteria.length === 0) {
                currentCriteriaSummaryTableContainer.innerHTML = '<p class="text-slate-500">Belum ada kriteria yang ditetapkan. Klik "Kelola Kriteria & Bobot" untuk menambahkan.</p>';
                return;
            }

            let tableHTML = '<table class="custom-table"><thead><tr><th>Nama Kriteria</th><th>Kunci</th><th>Tipe</th><th>Bobot Standar</th></tr></thead><tbody>';
            criteria.forEach(crit => {
                tableHTML += `<tr>
                                <td>${crit.name}</td>
                                <td>${crit.key}</td>
                                <td>${crit.type === 'cost' ? 'Cost (Biaya)' : 'Benefit (Keuntungan)'}</td>
                                <td class="text-right">${crit.weight.toFixed(2)}</td>
                                </tr>`;
            });
            tableHTML += '</tbody></table>';
            currentCriteriaSummaryTableContainer.innerHTML = tableHTML;
        }

        function formatCriterionDisplayValue(critKey, value) {
            if (value === undefined || value === null || value === '') return '(tidak ada data)';
            let displayValue = value;
            if (critKey === 'carPrice' || critKey === 'maintenanceCost') {
                displayValue = `Rp ${parseFloat(value).toLocaleString('id-ID')}${critKey === 'maintenanceCost' ? '/tahun' : ''}`;
            } else if (critKey === 'fuelConsumption') {
                displayValue = `${value} km/L`;
            } else if (critKey === 'passengerCapacity') {
                displayValue = `${value} orang`;
            } else if (critKey === 'safetyFeatures') {
                displayValue = `${value}/10`;
            }
            return displayValue;
        }

        function renderUserHistoryTable() {
            if (!userHistoryTableContainer) return;
            userHistoryTableContainer.innerHTML = '';

            if (userHistory.length === 0) {
                userHistoryTableContainer.innerHTML = '<p class="text-slate-500">Belum ada data riwayat pengguna untuk ditampilkan.</p>';
                return;
            }

            let tableHTML = '<table class="custom-table"><thead><tr><th>Waktu</th><th>Aksi</th><th>Detail</th></tr></thead><tbody>';
            userHistory.forEach(entry => {
                let detailContent = '';
                if (entry.actionType === "RECOMMENDATION_GENERATED" && entry.details) {
                    detailContent = `Mobil Teratas: ${entry.details.topCarName} (Skor: ${entry.details.topCarScore.toFixed(4)})<br>`;
                    if (entry.details.topCarCriteriaValues) {
                        detailContent += '<ul class="list-disc list-inside text-xs mt-1">';
                        for (const key in entry.details.topCarCriteriaValues) {
                            const crit = criteria.find(c => c.key === key);
                            const critName = crit ? crit.name.split('(')[0].trim() : key;
                            const displayValue = formatCriterionDisplayValue(key, entry.details.topCarCriteriaValues[key]);
                            detailContent += `<li><span class="font-medium">${critName}:</span> ${displayValue}</li>`;
                        }
                        detailContent += '</ul>';
                    }
                } else if (entry.actionType === "RECOMMENDATION_NO_MATCH") {
                    detailContent = `Tidak ada mobil yang cocok.`;
                }

                tableHTML += `<tr>
                                <td class="whitespace-nowrap">${entry.timestamp}</td>
                                <td class="whitespace-nowrap">${entry.actionType === "RECOMMENDATION_GENERATED" ? "Rekomendasi Dihasilkan" : "Pencarian Rekomendasi"}</td>
                                <td>${detailContent}</td>
                                </tr>`;
            });
            tableHTML += '</tbody></table>';
            userHistoryTableContainer.innerHTML = tableHTML;
        }


        function populateCriteriaFormForEdit(criterionKey) {
            const criterionToEdit = criteria.find(c => c.key === criterionKey);
            if (!criterionToEdit) return;

            editingCriterionKey = criterionKey;

            newCriterionName.value = criterionToEdit.name;
            newCriterionKey.value = criterionToEdit.key;
            newCriterionKey.readOnly = true;
            newCriterionType.value = criterionToEdit.type;
            newCriterionWeight.value = criterionToEdit.weight.toFixed(2);

            if (criteriaFormTitleElement) criteriaFormTitleElement.textContent = 'Edit Kriteria';
            addNewCriterionButton.textContent = 'Simpan Perubahan Kriteria';
            addNewCriterionButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            addNewCriterionButton.classList.add('bg-green-500', 'hover:bg-green-600');
        }

        function resetCriteriaForm() {
            editingCriterionKey = null;
            if (criteriaFormTitleElement) criteriaFormTitleElement.textContent = 'Tambah Kriteria Baru';
            if (newCriterionName) newCriterionName.value = '';
            if (newCriterionKey) {
                newCriterionKey.value = '';
                newCriterionKey.readOnly = false;
            }
            if (newCriterionType) newCriterionType.value = 'benefit';
            if (newCriterionWeight) newCriterionWeight.value = '0.00';
            if (addNewCriterionButton) {
                addNewCriterionButton.textContent = 'Tambah Kriteria';
                addNewCriterionButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                addNewCriterionButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
            }
        }


        function showCriteriaFormModal() {
            if (criteriaFormModal) {
                if (!editingCriterionKey) {
                    resetCriteriaForm();
                }
                renderCriteriaAdminList();
                criteriaFormModal.style.display = 'block';
            }
        }
        function hideCriteriaFormModal() {
            if (criteriaFormModal) {
                criteriaFormModal.style.display = 'none';
                resetCriteriaForm();
            }
        }

        function renderCriteriaAdminList() {
            if (!criteriaAdminList) return;
            criteriaAdminList.innerHTML = '';
            criteria.forEach((crit, index) => {
                const div = document.createElement('div');
                div.className = 'p-4 border border-slate-200 rounded-md bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0';
                div.innerHTML = `
                    <div class="flex-grow">
                        <span class="font-medium text-slate-800">${crit.name}</span>
                        <p class="text-xs text-slate-500">(Kunci: ${crit.key}, Tipe: ${crit.type})</p>
                        <label class="block text-sm font-medium text-slate-700 mt-2">Bobot Standar (0-1):</label>
                        <input type="number" value="${crit.weight.toFixed(2)}" step="0.01" min="0" max="1" data-index="${index}" class="criteria-weight-input mt-1 block w-full sm:w-32 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div class="flex space-x-2 mt-2 sm:mt-0 sm:ml-4 self-start sm:self-center">
                        <button data-key="${crit.key}" class="edit-criterion-modal-button bg-amber-500 hover:bg-amber-600 text-white text-xs py-1 px-2.5 rounded-md">Edit</button>
                        <button data-key="${crit.key}" class="delete-criterion-button bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2.5 rounded-md">Hapus</button>
                    </div>`;
                criteriaAdminList.appendChild(div);
            });
            document.querySelectorAll('.edit-criterion-modal-button').forEach(button => {
                button.addEventListener('click', (e) => populateCriteriaFormForEdit(e.target.dataset.key));
            });
            document.querySelectorAll('.delete-criterion-button').forEach(button => button.addEventListener('click', handleDeleteCriterion));
        }


        function handleAddCriterion() {
            const name = newCriterionName.value.trim();
            const key = newCriterionKey.value.trim().replace(/\s+/g, '_').toLowerCase();
            const type = newCriterionType.value;
            const weight = parseFloat(newCriterionWeight.value);
            let isValid = true;
            let errorMessages = [];

            if (!name) {
                errorMessages.push("Nama kriteria tidak boleh kosong.");
                isValid = false;
            }

            if (editingCriterionKey) {
                if (!key) {
                    errorMessages.push("Kunci kriteria (mode edit) tidak boleh kosong.");
                    isValid = false;
                }
            } else {
                if (!key) {
                    errorMessages.push("Kunci kriteria tidak boleh kosong.");
                    isValid = false;
                } else if (!/^[a-z0-9_]+$/.test(key)) {
                    errorMessages.push("Kunci kriteria hanya boleh berisi huruf kecil, angka, dan garis bawah (_).");
                    isValid = false;
                } else if (criteria.some(c => c.key === key)) {
                    errorMessages.push(`Kunci kriteria '${key}' sudah ada. Harap gunakan kunci yang unik.`);
                    isValid = false;
                }
            }

            if (isNaN(weight) || weight < 0 || weight > 1) {
                errorMessages.push("Bobot standar harus berupa angka antara 0 dan 1.");
                isValid = false;
            }

            if (!isValid) {
                showJsModal(errorMessages.join("\n"), false);
                return;
            }

            if (editingCriterionKey) {
                const criterionIndex = criteria.findIndex(c => c.key === editingCriterionKey);
                if (criterionIndex > -1) {
                    criteria[criterionIndex].name = name;
                    criteria[criterionIndex].type = type;
                    criteria[criterionIndex].weight = weight;
                    criteria[criterionIndex].userWeight = weight;
                    showTopBannerMessage('Kriteria berhasil diperbarui.');
                }
                resetCriteriaForm();
            } else {
                criteria.push({ name, key, weight, type, userWeight: weight, options: {} });
                showTopBannerMessage('Kriteria baru berhasil ditambahkan.');
                resetCriteriaForm();
            }

            saveAdminCriteria();
            renderCriteriaAdminList();
            renderCurrentCriteriaSummaryTable(); // Update table on CP page
        }

        function handleDeleteCriterion(e) {
            const keyToDelete = e.target.dataset.key;
            criteria = criteria.filter(c => c.key !== keyToDelete);
            cars.forEach(car => { delete car[keyToDelete]; if (car.normalizedValues) delete car.normalizedValues[keyToDelete]; });
            saveAdminCriteria();
            saveUserCars();
            renderCriteriaAdminList();
            if (document.getElementById('recommendationView').classList.contains('active-view')) renderUserCriteriaWeights();
            renderCurrentCriteriaSummaryTable(); // Update the summary on the CP page
            showTopBannerMessage(`Kriteria '${keyToDelete}' berhasil dihapus oleh Admin.`);
        }

        function setupAdminCriteriaEventListeners() {
            if (saveCriteriaButton) {
                saveCriteriaButton.addEventListener('click', () => {
                    const weightInputs = document.querySelectorAll('#criteriaFormModal .criteria-weight-input');
                    let totalStandardWeight = 0; let allWeightsValid = true;
                    let errorMessages = [];

                    weightInputs.forEach(input => {
                        const index = parseInt(input.dataset.index); const weightValue = parseFloat(input.value);
                        if (!isNaN(weightValue) && weightValue >= 0 && weightValue <= 1) {
                            criteria[index].weight = weightValue;
                            criteria[index].userWeight = weightValue;
                            totalStandardWeight += weightValue;
                        } else {
                            errorMessages.push(`Bobot standar untuk ${criteria[index].name} tidak valid.`);
                            allWeightsValid = false;
                        }
                    });
                    if (!allWeightsValid) {
                        showJsModal(errorMessages.join("\n"), false);
                        return;
                    }

                    if (Math.abs(totalStandardWeight - 1.0) > 0.01 && criteria.length > 0) {
                        showJsModal(`Total bobot standar (${totalStandardWeight.toFixed(2)}) harus mendekati 1. Sesuaikan bobot agar totalnya 1.`, false);
                        return;
                    }
                    saveAdminCriteria();
                    showTopBannerMessage('Semua perubahan bobot standar berhasil disimpan.');
                    renderCurrentCriteriaSummaryTable();
                    if (document.getElementById('recommendationView').classList.contains('active-view')) renderUserCriteriaWeights();
                });
            }
            if (addNewCriterionButton) addNewCriterionButton.addEventListener('click', handleAddCriterion);
        }

        function showCarFormModal(carToEdit = null) {
            if (!carFormModal || !formCarTitle || !carForm || !dynamicCarCriteriaFields) return;
            formCarTitle.textContent = carToEdit ? 'Edit Data Mobil' : 'Tambah Mobil Baru';
            carForm.reset();
            dynamicCarCriteriaFields.innerHTML = '';
            if (carToEdit) {
                carId_form_js.value = carToEdit.id; carName_form_js.value = carToEdit.name;
            } else {
                carId_form_js.value = ''; carName_form_js.value = '';
            }
            criteria.forEach(crit => {
                const value = carToEdit && carToEdit[crit.key] !== undefined ? carToEdit[crit.key] : '';
                let inputType = 'number'; let step = 'any'; let min = ''; let max = ''; let placeholder = `Nilai untuk ${crit.name.split('(')[0].trim()}`;

                if (crit.key === 'carPrice') { placeholder = 'Contoh: 150000000 (dalam Rp)'; step = '100000'; min = '0'; }
                else if (crit.key === 'fuelConsumption') { placeholder = 'Contoh: 15 (km/L)'; step = '0.1'; min = '0'; }
                else if (crit.key === 'passengerCapacity') { placeholder = 'Contoh: 5 (orang)'; step = '1'; min = '1'; }
                else if (crit.key === 'maintenanceCost') { placeholder = 'Contoh: 1000000 (Rp per tahun)'; step = '50000'; min = '0'; }
                else if (crit.key === 'safetyFeatures') { placeholder = 'Skor 1-10'; step = '1'; min = '1'; max = '10'; }

                const fieldDiv = document.createElement('div');
                fieldDiv.innerHTML = `<label for="car_${crit.key}_form_js" class="block text-sm font-medium text-slate-700">${crit.name}:</label><input type="${inputType}" id="car_${crit.key}_form_js" name="${crit.key}" required step="${step}" ${min ? `min="${min}"` : ''} ${max ? `max="${max}"` : ''} value="${value}" placeholder="${placeholder}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">`;
                dynamicCarCriteriaFields.appendChild(fieldDiv);
            });
            carFormModal.style.display = 'block';
        }

        function hideCarFormModal() { if (carFormModal) carFormModal.style.display = 'none'; }

        function setupUserCarFormEventListeners() {
            if (carForm) {
                carForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const id = carId_form_js.value ? parseInt(carId_form_js.value) : Date.now();
                    const newCar = { id: id, name: carName_form_js.value.trim() };
                    let formIsValid = true;
                    criteria.forEach(crit => {
                        const inputElement = document.getElementById(`car_${crit.key}_form_js`);
                        if (inputElement) {
                            const val = inputElement.value;
                            if (inputElement.type === 'number') { newCar[crit.key] = parseFloat(val); if (isNaN(newCar[crit.key]) && inputElement.required) formIsValid = false; }
                            else { newCar[crit.key] = val.trim(); if (!newCar[crit.key] && inputElement.required) formIsValid = false; }
                        } else if (inputElement.required) formIsValid = false;
                    });
                    if (!newCar.name) { showJsModal("Nama/Model mobil tidak boleh kosong.", false); return; }
                    if (!formIsValid) { showJsModal("Pastikan semua field kriteria yang wajib terisi dengan benar dan angka yang valid.", false); return; }

                    if (carId_form_js.value) { cars = cars.map(c => c.id === id ? newCar : c); showTopBannerMessage('Data mobil berhasil diperbarui.'); }
                    else { cars.push(newCar); showTopBannerMessage('Mobil baru berhasil ditambahkan.'); }
                    saveUserCars();
                    renderUserCarsListTable();
                    if (document.getElementById('recommendationView').classList.contains('active-view')) {
                        updateCurrentCarsInfoTable();
                    }
                    hideCarFormModal();
                });
            }
            const cancelBtn = document.getElementById('cancelCarFormModalButton');
            if (cancelBtn) cancelBtn.addEventListener('click', hideCarFormModal);
        }

        function renderUserCarsListTable() {
            if (!userCarsTableContainer) return;
            userCarsTableContainer.innerHTML = '';
            if (cars.length === 0) {
                userCarsTableContainer.innerHTML = '<p class="text-slate-500 text-center py-4">Belum ada data mobil. Klik "+ Tambah Mobil Baru" untuk memulai.</p>';
                return;
            }

            let tableHTML = '<table class="custom-table"><thead><tr><th>Nama Mobil</th>';
            criteria.forEach(crit => {
                tableHTML += `<th>${crit.name.split('(')[0].trim()}</th>`;
            });
            tableHTML += '<th class="action-column-header">Aksi</th></tr></thead><tbody>'; // Added class for print hiding

            cars.forEach(car => {
                tableHTML += `<tr><td>${car.name}</td>`;
                criteria.forEach(crit => {
                    tableHTML += `<td class="${typeof car[crit.key] === 'number' ? 'text-right' : ''}">${formatCriterionDisplayValue(crit.key, car[crit.key])}</td>`;
                });
                tableHTML += `<td class="action-buttons whitespace-nowrap">
                                <button data-id="${car.id}" class="edit-user-car-button bg-amber-500 hover:bg-amber-600 text-white text-xs py-1 px-2.5 rounded-md">Edit</button>
                                <button data-id="${car.id}" class="delete-user-car-button bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2.5 rounded-md">Hapus</button>
                                </td></tr>`;
            });
            tableHTML += '</tbody></table>';
            userCarsTableContainer.innerHTML = tableHTML;

            document.querySelectorAll('#userCarsTableContainer .edit-user-car-button').forEach(button => button.addEventListener('click', handleEditUserCar));
            document.querySelectorAll('#userCarsTableContainer .delete-user-car-button').forEach(button => button.addEventListener('click', handleDeleteUserCar));
        }

        function handleEditUserCar(e) {
            const idToEdit = parseInt(e.target.dataset.id);
            const carToEdit = cars.find(c => c.id === idToEdit);
            if (carToEdit) showCarFormModal(carToEdit);
        }

        function handleDeleteUserCar(e) {
            const idToDelete = parseInt(e.target.dataset.id);
            cars = cars.filter(c => c.id !== idToDelete);
            saveUserCars();
            renderUserCarsListTable();
            if (document.getElementById('recommendationView').classList.contains('active-view')) {
                updateCurrentCarsInfoTable();
            }
            showTopBannerMessage('Mobil berhasil dihapus dari daftar.');
        }

        function updateCurrentCarsInfoTable() {
            if (currentCarsInfoTableContainer) {
                currentCarsInfoTableContainer.innerHTML = '';

                if (cars.length > 0) {
                    let tableHTML = '<table class="custom-table"><thead><tr><th>Nama Mobil</th>';
                    criteria.forEach(crit => {
                        tableHTML += `<th>${crit.name.split('(')[0].trim()}</th>`;
                    });
                    tableHTML += '</tr></thead><tbody>';

                    cars.forEach(car => {
                        tableHTML += `<tr><td>${car.name}</td>`;
                        criteria.forEach(crit => {
                            tableHTML += `<td class="${typeof car[crit.key] === 'number' ? 'text-right' : ''}">${formatCriterionDisplayValue(crit.key, car[crit.key])}</td>`;
                        });
                        tableHTML += '</tr>';
                    });
                    tableHTML += '</tbody></table>';
                    currentCarsInfoTableContainer.innerHTML = tableHTML;

                } else {
                    const pNoCars = document.createElement('p');
                    pNoCars.className = 'text-center text-slate-500 py-4';
                    pNoCars.textContent = `Belum ada data mobil dalam sistem. Silakan tambahkan mobil melalui Control Panel.`;
                    currentCarsInfoTableContainer.appendChild(pNoCars);
                }
            }
        }

        function renderUserCriteriaWeights() {
            if (!userCriteriaWeightsContainer) return;
            userCriteriaWeightsContainer.innerHTML = '';
            criteria.forEach((crit, index) => {
                const div = document.createElement('div');
                div.className = 'flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0';
                const currentWeightForInput = crit.userWeight !== undefined ? crit.userWeight : crit.weight;
                div.innerHTML = `<label for="userWeight-${crit.key}" class="w-full sm:w-2/3 text-sm font-medium text-slate-700">${crit.name}:</label><input type="number" id="userWeight-${crit.key}" value="${currentWeightForInput.toFixed(2)}" step="0.01" min="0" max="1" data-index="${index}" class="user-criteria-weight-input mt-1 block w-full sm:w-1/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Bobot (Std: ${crit.weight.toFixed(2)})">`;
                userCriteriaWeightsContainer.appendChild(div);
            });
        }

        function generateRecommendationTableHTML(rankedCars, criteriaUsed) {
            let tableHTML = `<h3 class="text-2xl font-bold text-center mb-4 print-title">Tabel Perankingan Hasil Rekomendasi Mobil</h3>`;
            tableHTML += `<table class="custom-table"><thead><tr>`;
            tableHTML += `<th>Peringkat</th>`;
            tableHTML += `<th>Nama Mobil</th>`;
            tableHTML += `<th>Skor MAUT</th>`;
            criteriaUsed.forEach(crit => {
                tableHTML += `<th>${crit.name.split('(')[0].trim()}</th>`;
            });
            tableHTML += `</tr></thead><tbody>`;

            rankedCars.forEach((car, index) => {
                tableHTML += `<tr>`;
                tableHTML += `<td class="text-center">${index + 1}</td>`;
                tableHTML += `<td>${car.name}</td>`;
                tableHTML += `<td class="text-right">${car.score.toFixed(4)}</td>`;
                criteriaUsed.forEach(crit => {
                    tableHTML += `<td class="${typeof car[crit.key] === 'number' ? 'text-right' : ''}">${formatCriterionDisplayValue(crit.key, car[crit.key])}</td>`;
                });
                tableHTML += `</tr>`;
            });
            tableHTML += `</tbody></table>`;
            return tableHTML;
        }


        function setupRecommendationEventListeners() {
            if (getRecommendationButton) {
                getRecommendationButton.addEventListener('click', () => {
                    if (cars.length === 0) { showJsModal("Belum ada data mobil. Silakan tambahkan mobil melalui Control Panel terlebih dahulu.", false); if (resultsTableContainer) resultsTableContainer.innerHTML = '<p class="text-center text-red-500">Tidak ada data mobil untuk dianalisis.</p>'; rankedCarsDataForPrint = null; return; }
                    if (criteria.length === 0) { showJsModal("Belum ada kriteria evaluasi yang ditetapkan oleh Admin.", false); if (resultsTableContainer) resultsTableContainer.innerHTML = '<p class="text-center text-red-500">Tidak ada kriteria evaluasi.</p>'; rankedCarsDataForPrint = null; return; }

                    let criteriaForCalculation = JSON.parse(JSON.stringify(criteria));
                    let userTotalWeight = 0; let userInputProvided = false; let allUserWeightsValid = true;

                    document.querySelectorAll('.user-criteria-weight-input').forEach(input => {
                        const index = parseInt(input.dataset.index);
                        if (input.value.trim() !== "") {
                            userInputProvided = true; const weightValue = parseFloat(input.value);
                            if (!isNaN(weightValue) && weightValue >= 0 && weightValue <= 1) {
                                criteriaForCalculation[index].userWeight = weightValue;
                                userTotalWeight += weightValue;
                            }
                            else {
                                showJsModal(`Bobot ${criteriaForCalculation[index].name} tidak valid. Menggunakan bobot standar Admin.`, false);
                                criteriaForCalculation[index].userWeight = criteriaForCalculation[index].weight;
                                userTotalWeight += criteriaForCalculation[index].weight;
                                allUserWeightsValid = false;
                            }
                        } else {
                            criteriaForCalculation[index].userWeight = criteriaForCalculation[index].weight;
                            userTotalWeight += criteriaForCalculation[index].weight;
                        }
                    });
                    if (userInputProvided && Math.abs(userTotalWeight - 1.0) > 0.01 && allUserWeightsValid && criteria.length > 0) { showJsModal(`Total bobot preferensi (${userTotalWeight.toFixed(2)}) harus mendekati 1.`, false); rankedCarsDataForPrint = null; return; }
                    else if (!userInputProvided && criteria.length > 0) showTopBannerMessage('Menggunakan bobot standar dari Control Panel.', true);

                    const minMaxValues = {};
                    criteriaForCalculation.forEach(crit => {
                        if (crit.type === 'cost' || crit.type === 'benefit') {
                            const values = cars.map(car => car[crit.key]).filter(val => typeof val === 'number' && !isNaN(val));
                            minMaxValues[crit.key] = values.length > 0 ? { min: Math.min(...values), max: Math.max(...values) } : { min: 0, max: 0 };
                        }
                    });
                    const normalizedCars = cars.map(car => {
                        const normalizedValues = {};
                        criteriaForCalculation.forEach(crit => {
                            const carValue = car[crit.key]; let normValue = 0.5;
                            if (typeof carValue === 'number' && !isNaN(carValue)) {
                                const { min, max } = minMaxValues[crit.key] || { min: 0, max: 0 };
                                if (crit.type === 'cost') normValue = (max === min) ? ((carValue <= min) ? 1 : 0) : (max - carValue) / (max - min);
                                else if (crit.type === 'benefit') normValue = (max === min) ? ((carValue >= max) ? 1 : 0) : (carValue - min) / (max - min);
                            }
                            normalizedValues[crit.key] = isNaN(normValue) ? 0 : Math.max(0, Math.min(1, normValue));
                        });
                        return { ...car, normalizedValues };
                    });
                    const rankedCars = normalizedCars.map(car => {
                        let totalScore = 0;
                        criteriaForCalculation.forEach(crit => totalScore += (car.normalizedValues[crit.key] || 0) * crit.userWeight);
                        return { ...car, score: totalScore };
                    }).sort((a, b) => b.score - a.score);

                    rankedCarsDataForPrint = {
                        rankedCars: rankedCars,
                        criteriaForCalculation: criteriaForCalculation
                    };

                    if (resultsTableContainer) resultsTableContainer.innerHTML = generateRecommendationTableHTML(rankedCars, criteriaForCalculation);
                    if (recommendationTablePrintArea) recommendationTablePrintArea.innerHTML = '';

                    if (rankedCars.length === 0) {
                        if (resultsTableContainer) resultsTableContainer.innerHTML = '<p class="text-slate-500">Tidak ada mobil yang cocok dengan kriteria dan data yang ada.</p>';
                    }

                    // Update User History
                    if (rankedCars.length > 0) {
                        const topCar = rankedCars[0];
                        const topCarValues = {};
                        criteria.forEach(crit => {
                            if (topCar.hasOwnProperty(crit.key)) {
                                topCarValues[crit.key] = topCar[crit.key];
                            }
                        });

                        userHistory.unshift({
                            timestamp: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            actionType: "RECOMMENDATION_GENERATED",
                            details: {
                                topCarName: topCar.name,
                                topCarScore: topCar.score,
                                topCarCriteriaValues: topCarValues
                            }
                        });
                    } else {
                        userHistory.unshift({
                            timestamp: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            actionType: "RECOMMENDATION_NO_MATCH"
                        });
                    }

                    if (userHistory.length > 30) {
                        userHistory.pop();
                    }
                    saveUserHistory();
                    if (document.getElementById('controlPanelView').classList.contains('active-view') &&
                        document.getElementById('userHistoryContent').classList.contains('active-cp-content')) {
                        renderUserHistoryTable(); // Changed to table
                    }

                });
            }
        }

        function setupPrintEventListeners() {
            if (printRankingReportButton) {
                printRankingReportButton.addEventListener('click', () => {
                    if (!rankedCarsDataForPrint || rankedCarsDataForPrint.rankedCars.length === 0) {
                        showJsModal("Tidak ada hasil rekomendasi untuk dicetak. Silakan dapatkan rekomendasi terlebih dahulu.", false);
                        return;
                    }

                    const tableHtml = generateRecommendationTableHTML(rankedCarsDataForPrint.rankedCars, rankedCarsDataForPrint.criteriaForCalculation);
                    if (recommendationTablePrintArea) {
                        recommendationTablePrintArea.innerHTML = tableHtml;
                    }

                    document.body.classList.add('printing-recommendation-report');
                    document.body.classList.remove('printing-admin-report', 'printing-user-history-report');
                    window.print();
                });
            }

            if (printAdminCarListButton) {
                printAdminCarListButton.addEventListener('click', () => {
                    if (userCarsTableContainer && cars.length > 0) {
                        document.body.classList.add('printing-admin-report');
                        document.body.classList.remove('printing-recommendation-report', 'printing-user-history-report');
                        window.print();
                    } else {
                        showJsModal("Tidak ada daftar mobil admin untuk dicetak. Silakan tambahkan mobil di Control Panel.", false);
                    }
                });
            }

            if (printUserHistoryButton) {
                printUserHistoryButton.addEventListener('click', () => {
                    if (userHistoryTableContainer && userHistory.length > 0) {
                        document.body.classList.add('printing-user-history-report');
                        document.body.classList.remove('printing-recommendation-report', 'printing-admin-report');
                        window.print();
                    } else {
                        showJsModal("Tidak ada riwayat pengguna untuk dicetak.", false);
                    }
                });
            }


            window.onafterprint = () => {
                document.body.classList.remove('printing-recommendation-report', 'printing-admin-report', 'printing-user-history-report');
                if (recommendationTablePrintArea) {
                    recommendationTablePrintArea.innerHTML = '';
                }
            };
        }

        document.addEventListener('DOMContentLoaded', () => {
            topNavbar = document.querySelector('nav.top-navbar');
            mainContainer = document.querySelector('.main-container-flex');
            closeModalButtonJS = document.getElementById('closeModalButtonJS');
            messageModal = document.getElementById('messageModal');
            modalMessageText = document.getElementById('modalMessageText');
            jsMessageDiv = document.getElementById('jsMessage');
            jsMessageText = document.getElementById('jsMessageText');
            carFormModal = document.getElementById('carFormModal');
            closeCarFormModalButton = document.getElementById('closeCarFormModalButton');
            carForm = document.getElementById('carForm');
            formCarTitle = document.getElementById('formCarTitle');
            dynamicCarCriteriaFields = document.getElementById('dynamicCarCriteriaFields');
            carId_form_js = document.getElementById('carId_form_js');
            carName_form_js = document.getElementById('carName_form_js');

            showCriteriaFormButton = document.getElementById('showCriteriaFormButton');
            criteriaFormModal = document.getElementById('criteriaFormModal');
            criteriaFormTitleElement = document.getElementById('criteriaFormTitle');
            closeCriteriaFormModalButton = document.getElementById('closeCriteriaFormModalButton');
            cancelCriteriaFormModalButton = document.getElementById('cancelCriteriaFormModalButton');
            criteriaAdminList = document.getElementById('criteriaAdminList');
            saveCriteriaButton = document.getElementById('saveCriteriaButton');
            newCriterionName = document.getElementById('newCriterionName');
            newCriterionKey = document.getElementById('newCriterionKey');
            newCriterionType = document.getElementById('newCriterionType');
            newCriterionWeight = document.getElementById('newCriterionWeight');
            addNewCriterionButton = document.getElementById('addNewCriterionButton');
            currentCriteriaSummaryTableContainer = document.getElementById('currentCriteriaSummaryTableContainer');

            userCarsTableContainer = document.getElementById('userCarsTableContainer');
            showUserAddCarFormButtonCP = document.getElementById('showUserAddCarFormButtonCP');
            printAdminCarListButton = document.getElementById('printAdminCarListButton');
            userHistoryContent = document.getElementById('userHistoryContent');
            userHistoryTableContainer = document.getElementById('userHistoryTableContainer');
            printUserHistoryButton = document.getElementById('printUserHistoryButton');
            cpTopNavbar = document.getElementById('cpTopNavbar');
            recommendationTablePrintArea = document.getElementById('recommendationTablePrintArea');


            if (showUserAddCarFormButtonCP) showUserAddCarFormButtonCP.addEventListener('click', () => showCarFormModal(null));


            userCriteriaWeightsContainer = document.getElementById('userCriteriaWeights');
            getRecommendationButton = document.getElementById('getRecommendationButton');
            resultsTableContainer = document.getElementById('resultsTableContainer');
            currentCarsInfoTableContainer = document.getElementById('currentCarsInfoTableContainer');

            hamburgerButton = document.getElementById('hamburgerButton');
            navLinks = document.getElementById('navLinks');

            navButtonElements.homeButton = document.getElementById('homeButton');
            navButtonElements.controlPanelButtonNav = document.getElementById('controlPanelButtonNav');
            navButtonElements.recommendationButtonNav = document.getElementById('recommendationButtonNav');
            navButtonElements.goToRecommendationButtonHome = document.getElementById('goToRecommendationButtonHome');

            cpHomeButton = document.getElementById('cpHomeButton');
            cpRecommendationButton = document.getElementById('cpRecommendationButton');

            currentYearElement = document.getElementById('currentYear');
            if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();

            printRankingReportButton = document.getElementById('printRankingReportButton');


            const cancelCarFormBtn = document.getElementById('cancelCarFormModalButton');
            if (cancelCarFormBtn) cancelCarFormBtn.addEventListener('click', hideCarFormModal);

            document.querySelectorAll('#cpTopNavbar .cp-nav-button[data-content]').forEach(button => {
                button.addEventListener('click', () => {
                    const contentId = button.dataset.content;
                    showControlPanelContent(contentId);
                });
            });
            if (showCriteriaFormButton) {
                showCriteriaFormButton.addEventListener('click', () => {
                    resetCriteriaForm();
                    showCriteriaFormModal();
                });
            }


            setupModalEventListeners();
            setupNavigationEventListeners();
            setupAdminCriteriaEventListeners();
            setupUserCarFormEventListeners();
            setupRecommendationEventListeners();
            setupPrintEventListeners();

            showView('homeView');
            if (cpTopNavbar) cpTopNavbar.classList.add('hidden');
        });