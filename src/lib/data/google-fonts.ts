export type FontCategory = 'Sans-Serif' | 'Serif' | 'Display' | 'Handwriting' | 'Monospace';

export interface FontData {
  family: string;
  category: FontCategory;
}

export const SYSTEM_FONTS: FontData[] = [
  { family: 'Arial', category: 'Sans-Serif' },
  { family: 'Helvetica', category: 'Sans-Serif' },
  { family: 'Verdana', category: 'Sans-Serif' },
  { family: 'Tahoma', category: 'Sans-Serif' },
  { family: 'Trebuchet MS', category: 'Sans-Serif' },
  { family: 'System Default', category: 'Sans-Serif' },
  { family: 'Times New Roman', category: 'Serif' },
  { family: 'Georgia', category: 'Serif' },
  { family: 'Garamond', category: 'Serif' },
  { family: 'Courier New', category: 'Monospace' },
  { family: 'Brush Script MT', category: 'Handwriting' },
];

export const GOOGLE_FONTS: FontData[] = [
  // Sans-Serif
  { family: 'Roboto', category: 'Sans-Serif' },
  { family: 'Open Sans', category: 'Sans-Serif' },
  { family: 'Noto Sans', category: 'Sans-Serif' },
  { family: 'Montserrat', category: 'Sans-Serif' },
  { family: 'Lato', category: 'Sans-Serif' },
  { family: 'Poppins', category: 'Sans-Serif' },
  { family: 'Inter', category: 'Sans-Serif' },
  { family: 'Oswald', category: 'Sans-Serif' },
  { family: 'Raleway', category: 'Sans-Serif' },
  { family: 'Nunito', category: 'Sans-Serif' },
  { family: 'Ubuntu', category: 'Sans-Serif' },
  { family: 'Rubik', category: 'Sans-Serif' },
  { family: 'Work Sans', category: 'Sans-Serif' },
  { family: 'Quicksand', category: 'Sans-Serif' },
  { family: 'Karla', category: 'Sans-Serif' },
  { family: 'Barlow', category: 'Sans-Serif' },
  { family: 'Mulish', category: 'Sans-Serif' },
  { family: 'PT Sans', category: 'Sans-Serif' },
  { family: 'Hind', category: 'Sans-Serif' },
  { family: 'Fira Sans', category: 'Sans-Serif' },
  { family: 'Heebo', category: 'Sans-Serif' },
  { family: 'Josefin Sans', category: 'Sans-Serif' },
  { family: 'Public Sans', category: 'Sans-Serif' },
  { family: 'Outfit', category: 'Sans-Serif' },
  { family: 'DM Sans', category: 'Sans-Serif' },
  { family: 'Space Grotesk', category: 'Sans-Serif' },
  { family: 'Sora', category: 'Sans-Serif' },
  { family: 'Manrope', category: 'Sans-Serif' },
  { family: 'Lexend', category: 'Sans-Serif' },
  { family: 'Plus Jakarta Sans', category: 'Sans-Serif' },
  { family: 'Figtree', category: 'Sans-Serif' },
  { family: 'Onest', category: 'Sans-Serif' },
  
  // Serif
  { family: 'Merriweather', category: 'Serif' },
  { family: 'Playfair Display', category: 'Serif' },
  { family: 'Lora', category: 'Serif' },
  { family: 'PT Serif', category: 'Serif' },
  { family: 'Noto Serif', category: 'Serif' },
  { family: 'Crimson Text', category: 'Serif' },
  { family: 'EB Garamond', category: 'Serif' },
  { family: 'Libre Baskerville', category: 'Serif' },
  { family: 'Bitter', category: 'Serif' },
  { family: 'Source Serif 4', category: 'Serif' },
  { family: 'Cormorant Garamond', category: 'Serif' },
  { family: 'Domine', category: 'Serif' },
  { family: 'Zilla Slab', category: 'Serif' },
  { family: 'DM Serif Display', category: 'Serif' },
  { family: 'Fraunces', category: 'Serif' },
  
  // Display
  { family: 'Bebas Neue', category: 'Display' },
  { family: 'Righteous', category: 'Display' },
  { family: 'Alfa Slab One', category: 'Display' },
  { family: 'Abril Fatface', category: 'Display' },
  { family: 'Bungee', category: 'Display' },
  { family: 'Fredoka', category: 'Display' },
  { family: 'Anton', category: 'Display' },
  { family: 'Archivo Black', category: 'Display' },
  { family: 'Concert One', category: 'Display' },
  { family: 'Russo One', category: 'Display' },
  
  // Handwriting
  { family: 'Dancing Script', category: 'Handwriting' },
  { family: 'Pacifico', category: 'Handwriting' },
  { family: 'Caveat', category: 'Handwriting' },
  { family: 'Satisfy', category: 'Handwriting' },
  { family: 'Amatic SC', category: 'Handwriting' },
  { family: 'Great Vibes', category: 'Handwriting' },
  { family: 'Kalam', category: 'Handwriting' },
  { family: 'Courgette', category: 'Handwriting' },
  { family: 'Permanent Marker', category: 'Handwriting' },
  
  // Monospace
  { family: 'Roboto Mono', category: 'Monospace' },
  { family: 'Inconsolata', category: 'Monospace' },
  { family: 'Source Code Pro', category: 'Monospace' },
  { family: 'Space Mono', category: 'Monospace' },
  { family: 'IBM Plex Mono', category: 'Monospace' },
  { family: 'Fira Code', category: 'Monospace' },
  { family: 'JetBrains Mono', category: 'Monospace' },
];
