document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('meuGrafico');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], 
                datasets: [{
                    label: 'Atendimentos',
                    data: [1, 5, 2, 14, 2, 7], 
                    borderColor: '#669a9f', 
                    backgroundColor: 'rgba(102, 154, 159, 0.15)', 
                    borderWidth: 2,
                    tension: 0.4, 
                    fill: true,   
                    pointRadius: 0 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } 
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 15,
                        ticks: {
                            stepSize: 5, 
                            font: {
                                family: "'Montserrat', sans-serif",
                                size: 12
                            },
                            color: '#888'
                        },
                        border: { display: false },
                        grid: {
                            color: '#f0f0f0' 
                        }
                    },
                    x: {
                        display: false 
                    }
                }
            }
        });
    }
});

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('menu-aberto');
    });
}