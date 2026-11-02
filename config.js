// CONFIGURACIÓN EDITABLE. No requiere instalar nada ni compilar.
window.WEDDING_CONFIG = {
  ceremonyDate: '2027-02-27T20:00:00-03:00',
  whatsappNumber: '+5493489527122', // Celular internacional: 549 + área + número, sin 0 ni 15.
  // Si se deja vacío, se muestra el fondo floral decorativo.
  coverPhoto: './assets/SesionM&E-86.jpg',
  // Reemplazá cada src vacío por una ruta: 'assets/historia-1.jpg'.
  // Podés agregar o quitar elementos; el carrusel se adapta automáticamente.
  galleries: {
    history: [
      { src: './assets/SesionM&E-9.jpg', alt: 'Un momento de nuestra historia', position: 'center' },
      { src: './assets/SesionM&E-36.jpg', alt: 'Otro recuerdo juntos', position: 'center' },
      { src: './assets/SesionM&E-45.jpg', alt: 'Una historia que sigue creciendo', position: 'center' }
    ],
    couple: [
      { src: './assets/SesionM&E-94.jpg', alt: 'Victoria y Eduardo', position: 'center' },
      { src: './assets/SesionM&E-101.jpg', alt: 'Un retrato de los dos', position: 'center' },
      { src: './assets/SesionM&E-58.jpg', alt: 'Juntos, siempre', position: 'center' }
    ]
  }
};
