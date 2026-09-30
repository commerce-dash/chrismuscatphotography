# Private Images Setup

This setup keeps your images in a private GitHub repository while keeping the main site repository public.

## Why This Approach

- Main repository (`chrismuscatphotography`) can remain public
- Images live in a separate private repository (`chrismuscat-images` or similar)
- GitHub Actions fetches private images during build
- Built site includes images but the source images stay private
- No image files are tracked in the public main repository

## Setup Instructions

### 1. Create Private Images Repository

1. Go to GitHub and create a new private repository
2. Name it something like `chrismuscat-images`
3. Initialize it with a README (optional)
4. Create the folder structure:
   ```
   chrismuscat-images/
   └── public/
       └── images/
           ├── uploads/
           └── generated/
   ```

### 2. Configure GitHub Secrets

In your main repository (`chrismuscatphotography`), go to:
- Settings → Secrets and variables → Actions
- Add the following secrets:

**`PRIVATE_IMAGES_REPO`**
- Value: `your-username/chrismuscat-images` (replace with your actual username and repo name)

**`PRIVATE_IMAGES_TOKEN`**
- Value: A GitHub Personal Access Token (PAT) with `repo` scope
- How to create:
  1. Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token
  3. Select scopes: `repo` (full control of private repositories)
  4. Copy the token and paste it as the secret value

### 3. Local Development Setup

For local development, you have two options:

**Option A: Clone both repos locally**
```bash
# Clone main repo
git clone https://github.com/your-username/chrismuscatphotography.git
cd chrismuscatphotography

# Clone private images repo as a subdirectory
git clone https://github.com/your-username/chrismuscat-images.git private-images

# Symlink the images folder (Linux/Mac)
ln -s ../private-images/public/images public/images

# Or copy on Windows (run as Administrator)
mklink /D public\images private-images\public\images
```

**Option B: Copy images locally**
```bash
# Clone private repo
git clone https://github.com/your-username/chrismuscat-images.git private-images

# Copy images to main repo
cp -r private-images/public/images/* chrismuscatphotography/public/images/
```

### 4. Update .gitignore

Ensure `public/images/` is in `.gitignore` in the main repo so images aren't tracked there:

```gitignore
# Images are stored in private repo
public/images/
```

### 5. Workflow

**Adding new images:**
1. Add images to `chrismuscat-images/public/images/uploads/`
2. Push to the private images repo
3. The main repo's GitHub Actions will automatically fetch them on next build

**Syncing local folder upload:**
- Update the local folder path in your CMS admin to point to the private images checkout location

## Important Notes

- **Private images are still accessible in the built site** — the `dist/` folder deployed to GitHub Pages will contain the images. This solution keeps the *source* private, not the *served* files.
- **For true image privacy**, consider:
  - Using a CDN with access controls
  - Server-side image serving with authentication
  - Separate password-protected subdomain
- **Token security**: The PAT should be treated like a password. Rotate it periodically.
- **Backup**: Private images repo should be backed up regularly.

## Testing

1. Push to the private images repo
2. Push to the main repo
3. Check the GitHub Actions build logs for "Copied private images" message
4. Verify images appear on the deployed site
