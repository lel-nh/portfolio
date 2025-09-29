document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById('track');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  let index = 0;

  setInterval(() => {
    index = (index + 1) % totalSlides;
    track.style.transform = `translateX(-${index * 100}%)`; // translate en pixels = largeur de slide * index
  }, 4000);
});