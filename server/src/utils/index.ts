export const genUsername = (): string => { 
    const usernamePrefix = 'user-'; 
    const randomChars = Math.random().toString(36).slice(2); 

    const username = usernamePrefix + randomChars; 

    return username; 
}

export const genSlug = (title: string): string => {
    const slug = title
        .toLowerCase()
        .trim()
        // hapus semua karakter selain huruf, angka, spasi, dan dash
        .replace(/[^a-z0-9\s-]/g, '')
        // ganti spasi / underscore beruntun jadi dash
        .replace(/[\s_-]+/g, '-')
        // hapus dash di awal & akhir
        .replace(/^-+|-+$/g, '');

    const randomChars = Math.random().toString(36).slice(2, 8);
    const uniqueSlug = `${slug}-${randomChars}`;

    return uniqueSlug;
};
