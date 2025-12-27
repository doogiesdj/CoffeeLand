# CoffeeLand Ontology Viewer

An interactive web application for visualizing the CoffeeLand RDF/OWL ontology, showcasing the global coffee supply chain through semantic web technology.

## 🌟 Features

- **Sidebar Navigation Layout**: Easy-to-use sidebar menu with categorized sections
- **Interactive Visualization**: D3.js-powered network graph showing entity relationships
- **RDF/OWL Ontology**: Semantic web technology for rich data representation
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar
- **Real-time Data**: Dynamic parsing and visualization of RDF data

## 📁 Project Structure

```
coffeeland-react/
├── public/
│   └── coffeeland.rdf         # RDF ontology file
├── src/
│   ├── components/            # React components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── pages/                 # Page components
│   │   ├── Home.jsx
│   │   ├── Countries.jsx
│   │   ├── Brands.jsx
│   │   ├── Chains.jsx
│   │   ├── Brokers.jsx
│   │   ├── Visualization.jsx
│   │   └── About.jsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useRDFData.js
│   ├── utils/                 # Utility functions
│   │   └── rdfParser.js
│   └── styles/                # CSS stylesheets
├── amplify.yml                # AWS Amplify configuration
└── package.json
```

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **D3.js**: Data visualization
- **Lucide React**: Icon library

### Semantic Web
- **RDF/XML**: Resource Description Framework
- **OWL**: Web Ontology Language
- **RDFLib**: RDF parsing and querying
- **Protégé**: Ontology editor

### Hosting
- **AWS Amplify**: Continuous deployment and hosting
- **GitHub**: Version control and CI/CD integration
- **Custom Domain**: tonicloud.org

## 🚀 Getting Started

### Prerequisites
- Node.js 14 or higher
- npm 6 or higher
- Git

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd webapp/coffeeland-react
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📊 Ontology Structure

### Main Classes
- **Location**: Countries, cities, and capitals
- **Product**: Coffee beans and coffee brands
- **Organization**: Coffee chains and brokers

### Key Relationships
- `produces`: Countries produce coffee brands
- `isLocatedIn`: Cities are located in countries
- `operatesIn`: Coffee chains operate in cities
- `mediates`: Brokers mediate coffee trades
- `suppliesTo`: Brokers supply to coffee chains
- `buysFrom`: Coffee chains buy from brokers

## 🌐 AWS Deployment

### AWS Account Setup
- **AWS Account ID**: 452897072617
- **Domain**: tonicloud.org

### Deployment Steps

1. **Connect to GitHub**:
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Build Settings**:
   - AWS Amplify will automatically detect the `amplify.yml` configuration
   - Build directory: `coffeeland-react/dist`
   - Build command: `npm run build`

3. **Set Environment Variables** (if needed):
   - No environment variables required for this project

4. **Custom Domain**:
   - Go to Domain Management in Amplify Console
   - Add custom domain: `tonicloud.org`
   - Follow DNS configuration instructions
   - Wait for SSL certificate provisioning

5. **Deploy**:
   - Amplify will automatically build and deploy on every push to the main branch
   - Access your app at the Amplify-provided URL or your custom domain

### Continuous Deployment
Every push to the main branch will trigger an automatic deployment:
1. AWS Amplify detects the commit
2. Runs `npm ci` to install dependencies
3. Runs `npm run build` to create production build
4. Deploys the `dist/` directory to CDN
5. App is live at `tonicloud.org`

## 📖 Usage Guide

### Navigation
- **Home**: Overview and statistics
- **Countries**: Browse coffee-producing nations
- **Brands**: Explore coffee brands
- **Chains**: View coffee retail chains
- **Brokers**: See supply chain intermediaries
- **Visualization**: Interactive network graph
- **About**: Project information

### Network Visualization
- **Zoom**: Use mouse wheel to zoom in/out
- **Pan**: Click and drag to move the canvas
- **Drag Nodes**: Click and drag nodes to rearrange
- **Hover**: Hover over nodes to see details

## 🔧 Development

### Adding New Data
1. Edit `public/coffeeland.rdf` using Protégé or text editor
2. Follow OWL/RDF syntax
3. Refresh the application to see changes

### Customizing Styles
- Modify CSS files in `src/styles/`
- Each page has its own stylesheet
- Use CSS variables for consistent theming

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Sidebar.jsx`
4. Create corresponding stylesheet

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👤 Author

Built with ❤️ using semantic web technologies

## 🙏 Acknowledgments

- Protégé ontology editor
- RDFLib JavaScript library
- D3.js visualization library
- React and Vite communities

---

**Powered by AWS Amplify | Hosted on tonicloud.org**
