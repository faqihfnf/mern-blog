import Banner from "../models/banner.model.js";
import { errorHandler } from "../utils/error.js";

//# Create new banner
export const createBanner = async (req, res, next) => {
  try {
    const { image, title, description, link, cta } = req.body;

    if (!description || !title || !link) {
      return next(errorHandler(400, "All fields are required"));
    }

    const newBanner = new Banner({
      image,
      title,
      description,
      link,
      cta,
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    next(error);
  }
};

//# Get all banner
export const getBanner = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (startIndex - 1) * limit;

    const totalBanners = await Banner.countDocuments();

    // Mengambil produk sesuai dengan paginasi
    const banners = await Banner.find()
      .sort({ createdAt: -1 }) // Mengurutkan dari yang terbaru
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      banners,
      totalBanners,
      startIndex,
      totalPages: Math.ceil(totalBanners / limit),
    });
  } catch (error) {
    next(error);
  }
};

//#Update Banner
export const updateBanner = async (req, res, next) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.bannerId,
      {
        $set: {
          image: req.body.image,
          title: req.body.title,
          description: req.body.description,
          link: req.body.link,
          cta: req.body.cta,
        },
      },
      { new: true } // Mengembalikan data setelah diperbarui
    );

    if (!updatedBanner) {
      return next(errorHandler(404, "Banner not found"));
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    next(error);
  }
};

//#Delete Banner
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);

    if (!banner) {
      return next(errorHandler(404, "Banner not found"));
    }

    await Banner.findByIdAndDelete(req.params.bannerId);
    res.status(200).json("Banner has been deleted");
  } catch (error) {
    next(error);
  }
};

//# Get banner byId
export const getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);
    if (!banner) {
      return next(errorHandler(404, "Banner not found"));
    }
    res.status(200).json(banner);
  } catch (error) {
    next(error);
  }
};
