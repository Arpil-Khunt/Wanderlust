const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schemaValidation.js");
const Review = require("./models/review.js");

let isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    return res.redirect("/login");
  }
  next();
};
let saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

let isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (res.locals.currUser && !res.locals.currUser._id.equals(listing.owner)) {
    req.flash("error", "you are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//for review author
let isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (
    res.locals.currUser &&
    !res.locals.currUser._id.equals(review.createdBy)
  ) {
    req.flash("error", "you are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validation for listing schema-------serverside
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validation for reviewSchema --------serverside
const validationReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  validateListing,
  validationReview,
  isReviewAuthor,
};
