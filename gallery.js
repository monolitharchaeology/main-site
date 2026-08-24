/* Gallery Images Data */
const galleryImages = [
    'images/gallary/550436642_122160817454957024_5961942707060879902_n.jpg',
    'images/gallary/558930717_122157771140957024_5480947312550729623_n.jpg',
    'images/gallary/558965674_122156373254957024_3058129964682411630_n.jpg',
    'images/gallary/558973977_122158617146957024_5836140209134999180_n.jpg',
    'images/gallary/560917674_122158617278957024_5469613585310496840_n.jpg',
    'images/gallary/560922462_122159825264957024_3817902256092210947_n.jpg',
    'images/gallary/561054106_122159810600957024_1579773196315101796_n.jpg',
    'images/gallary/561176399_122158617218957024_2721842582847385245_n.jpg',
    'images/gallary/561340886_122157770984957024_9038806878862528869_n.jpg',
    'images/gallary/561635594_122159825036957024_8723085578423068157_n.jpg',
    'images/gallary/561840792_122158608578957024_1737776847238742492_n.jpg',
    'images/gallary/565109352_122160817364957024_7984293370522234432_n.jpg',
    'images/gallary/565135523_122158617500957024_486932991520917234_n.jpg',
    'images/gallary/565298128_122160817268957024_1756523839798782795_n.jpg',
    'images/gallary/565330560_122160817340957024_7802644854682940911_n.jpg',
    'images/gallary/565666147_122160817388957024_5733304702232456861_n.jpg',
    'images/gallary/568153811_122160817190957024_5101738589701732234_n.jpg',
    'images/gallary/571141678_122163106436957024_1918254636864954575_n.jpg',
    'images/gallary/571152355_122163106478957024_7891155039983651963_n.jpg',
    'images/gallary/571247473_122163106430957024_150002260093302764_n.jpg',
    'images/gallary/571311905_122163106310957024_5227525590711287896_n.jpg',
    'images/gallary/571422439_122163106562957024_972207101771533293_n.jpg',
    'images/gallary/572354858_122163106556957024_9099635241782987629_n.jpg'
];

let currentIndex = 0;
let modalImageIndex = 0;
const imagesPerLoad = 6;
let isLoading = false;

const galleryGrid = document.getElementById('galleryGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const galleryModal = document.getElementById('galleryModal');
const galleryModalImg = document.getElementById('galleryModalImg');
const galleryModalClose = document.querySelector('.gallery-modal-close');
const galleryModalPrev = document.querySelector('.gallery-modal-prev');
const galleryModalNext = document.querySelector('.gallery-modal-next');

/* Load initial images */
window.addEventListener('load', () => {
    loadMoreImages();
});

/* Infinite scroll functionality */
window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 500 && !isLoading && currentIndex < galleryImages.length) {
        loadMoreImages();
    }
});

function loadMoreImages() {
    if (isLoading || currentIndex >= galleryImages.length) return;

    isLoading = true;
    loadingSpinner.style.display = 'block';

    // Simulate a slight delay for better UX
    setTimeout(() => {
        const imagesToLoad = galleryImages.slice(currentIndex, currentIndex + imagesPerLoad);

        imagesToLoad.forEach((imageSrc) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = 'Gallery image';
            img.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';

            const zoomIcon = document.createElement('i');
            zoomIcon.className = 'fas fa-search-plus';

            overlay.appendChild(zoomIcon);
            galleryItem.appendChild(img);
            galleryItem.appendChild(overlay);

            galleryItem.addEventListener('click', () => {
                openModal(imageSrc);
            });

            galleryGrid.appendChild(galleryItem);
        });

        currentIndex += imagesPerLoad;
        isLoading = false;
        loadingSpinner.style.display = 'none';
    }, 300);
}

/* Modal functionality */
function openModal(imageSrc) {
    modalImageIndex = galleryImages.indexOf(imageSrc);
    galleryModal.style.display = 'flex';
    updateModalImage();
    document.body.style.overflow = 'hidden';
}

function updateModalImage() {
    galleryModalImg.src = galleryImages[modalImageIndex];
}

function navigateModal(direction) {
    modalImageIndex = (modalImageIndex + direction + galleryImages.length) % galleryImages.length;
    updateModalImage();
}

function closeModal() {
    galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

galleryModalClose.addEventListener('click', closeModal);
galleryModalPrev.addEventListener('click', () => navigateModal(-1));
galleryModalNext.addEventListener('click', () => navigateModal(1));

galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (galleryModal.style.display !== 'flex') return;

    if (e.key === 'ArrowLeft') {
        navigateModal(-1);
    } else if (e.key === 'ArrowRight') {
        navigateModal(1);
    } else if (e.key === 'Escape') {
        closeModal();
    }
});
