const { HfInference } = require("@huggingface/inference");

// Create one instance and reuse it everywhere
const hf = new HfInference(process.env.HF_TOKEN);

module.exports = hf;