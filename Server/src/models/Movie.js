import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalTitle: String,
    overview: {
      type: String,
      default: '',
    },
    tagline: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: String,
    genres: [
      {
        id: Number,
        name: String,
      },
    ],
    runtime: {
      type: Number,
      default: 120, // in minutes
    },
    voteAverage: {
      type: Number,
      default: 0,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    popularity: Number,
    originalLanguage: String,
    spokenLanguages: [String],
    certification: {
      type: String,
      default: 'UA',
    },
    trailerUrl: String,
    trailerKey: String,
    cast: [
      {
        id: Number,
        name: String,
        character: String,
        profilePath: String,
      },
    ],
    status: {
      type: String,
      enum: ['now_playing', 'upcoming', 'archived'],
      default: 'now_playing',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    formats: {
      type: [String],
      default: ['2D', '3D', 'IMAX 3D', '4DX'],
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
