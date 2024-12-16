document.getElementById('clusterForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Faixas de valores
    const ranges = {
        price: { min: 5999, max: 480000 },
        processor_speed: { min: 1.6, max: 3.2 },
        battery_capacity: { min: 1821, max: 22000 },
        ram_capacity: { min: 2, max: 18 },
        internal_memory: { min: 32, max: 512 }
    };

    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    // Coleta de dados
    const form = event.target;
    const inputData = [
        normalize(parseFloat(form.price.value), ranges.price.min, ranges.price.max),
        normalize(parseFloat(form.processor_speed.value), ranges.processor_speed.min, ranges.processor_speed.max),
        normalize(parseFloat(form.battery_capacity.value), ranges.battery_capacity.min, ranges.battery_capacity.max),
        normalize(parseFloat(form.ram_capacity.value), ranges.ram_capacity.min, ranges.ram_capacity.max),
        normalize(parseFloat(form.internal_memory.value), ranges.internal_memory.min, ranges.internal_memory.max)
    ];

    // Centroides reais extraídos do PMML
    const centroids = {
        cluster_0: [0.01901736812797728, 0.31104312747571033, 0.1614876415156404, 0.179778286276634, 0.13169691301033007],
        cluster_1: [0.035031037142296766, 0.4669773761238257, 0.15028466140647326, 0.3240585799639736, 0.21762884781533562],
        cluster_2: [0.0781902059573754, 0.8914723612025328, 0.147613097467703, 0.4164097371159149, 0.2876840989837891]
    };

    function calculateDistance(point1, point2) {
        return Math.sqrt(point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0));
    }

    // Cálculo do cluster
    let minDistance = Infinity;
    let assignedCluster = '';
    for (const [cluster, centroid] of Object.entries(centroids)) {
        const distance = calculateDistance(inputData, centroid);
        if (distance < minDistance) {
            minDistance = distance;
            assignedCluster = cluster;

            
        }
    }

    // Resultado
    let message = '';
    let phoneImage = '';
    let description = '';

    switch (assignedCluster) {
        case 'cluster_0':
            message = '<strong>Cluster 0:</strong> Dispositivos básicos.';
            phoneImage = 'img/celularBarato.jpg';  // Caminho para o celular barato
            description = 'Smartphone Positivo Twist 5 S620, 1GB RAM 64GB, Dual Chip, Tela Notch de 6.26”, Câmera Traseira 8MP + Selfie 5MP, Android 11 Go – Black Piano';
            break;
        case 'cluster_1':
            message = '<strong>Cluster 1:</strong> Dispositivos intermediários.';
            phoneImage = 'img/celularMedio.jpg';  // Caminho para o celular intermediário
            description = 'Smartphone Xiaomi POCO X6 Pro 5G 8GB+256GB NFC Dimensity 8300-Ultra 64MP câmera tripla 67W 120Hz AMOLED (Preto)';
            break;
        case 'cluster_2':
            message = '<strong>Cluster 2:</strong> Dispositivos Premium.';
            phoneImage = 'img/celularCaro.jpg';  // Caminho para o celular caro
            description = 'Apple iPhone 16 Pro Max (1 TB) – Titânio-deserto Marca: Apple Sistema operacional: iOS Capacidade de armazenamento da memória: 1 TB Tamanho da tela: 6,9 Polegadas';
            break;
    }

    // Exibe a recomendação com a imagem e a descrição
    document.getElementById('result').innerHTML = `<strong>Recomendação:</strong><br><br>${message}<br><br>`;
    document.getElementById('result').innerHTML += `<p><strong>Descrição:</strong><br>${description}</p>`;
    document.getElementById('result').innerHTML += `<img src="${phoneImage}" alt="Imagem do celular" class="phone-image">`;
});
